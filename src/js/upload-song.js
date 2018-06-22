{
    let view = {
        el: '.page > main .file-uploader',
        template: `
            <div class="file-select-wrap">
                <input class="file-input" type="file" id="select" accept="audio/*" />
                <span>点击或拖拽文件上传</span>
            </div>
            <div class="file-info">
                <ul class="clearfix">
                    <li>FileName：<span id="file-name">__key__</span></li>
                    <li>Size：<span id="file-size">__size__</span></li>
                    <li>Process：<span id="file-process">__percent__</span></li>
                </ul>
                <span class="process-bar"></span>
            </div>
        `,
        render(data = {}){
            let placeholder = ['key', 'size', 'percent'];
            let html = this.template;
            placeholder.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            });
            $(this.el).html(html);
        }
    };
    let model = {};
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render();
            this.initQiniu(this.createUptoken());
            window.eventHub.on( 'render-upload', (data)=>{this.view.render(data)})
        },
        createUptoken(){
            let domain,token;
            $.ajax({
                url: 'http://localhost:8888/uptoken',
                async: false,
                success: function (res){
                    domain = res.domain;
                    token = res.uptoken;
                }
            });
            return {token, domain}
        },
        initQiniu(tokenDomain){
            $("#select").unbind("change").bind("change", function() {
                var file = this.files[0];
                if (file) {
                    var key = file.name;
                    var size = file.size / 1024;

                    if(size > 500){
                        size = (size / 1024).toFixed(1) + 'MB'
                    }else{
                        size = size.toFixed(1) + 'KB'
                    }

                    var name, singer;
                    window.jsmediatags.read(file, {
                        onSuccess: (tag) => {
                            name = tag.tags.title;
                            singer = tag.tags.artist;
                            return {name,singer}
                        },
                        onError: function(error) {
                            console.log(':(', error.type, error.info);
                        }
                    });

                    $(view.el).find('.process-bar').width(0);
                    $(view.el).find('.process-bar').removeClass('complete');
                }
                var token = tokenDomain.token;
                var domain = tokenDomain.domain;
                var putExtra = {
                    fname: "",
                    params: {},
                    mimeType: null
                };
                var config = {
                    disableStatisticsReport: false,
                    retryCount: 6,
                    region: qiniu.region.z1
                };
                var observer = {
                    next(res){
                        let percent = Math.floor(res.total.percent) + '%';
                        view.render({key,size,percent});
                        $(view.el).find('.process-bar').width(percent);
                    },
                    error(err){
                        console.log(err);
                        alert('上传失败，请重试');
                    },
                    complete(res){
                        alert('上传成功');
                        $(view.el).find('.process-bar').addClass('complete');
                        let url = 'http://' + domain + '/' + encodeURIComponent(res.key);

                        window.eventHub.emit('renderForm',{name,singer,url})
                    }
                };
                var observable = qiniu.upload(
                    file,
                    key,
                    token,
                    putExtra,
                    config
                );
                var subscription = observable.subscribe(observer); // 上传开始
            });
        },
    };
    controller.init(view,model);
}