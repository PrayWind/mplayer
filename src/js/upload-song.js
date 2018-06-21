{
    let view = {
        el: '.page > main',
        template: `
            <div class="title">
                <h2>新增歌曲</h2>
            </div>
            <div class="content">
                <div class="song-info">
                    <form>
                        <div class="row">
                            <label for="song-name">歌曲标题：</label>
                            <input id="song-name" name="song" type="text" />
                        </div>
                        <div class="row">
                            <label for="song-singer">歌&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手：</label>
                            <input id="song-singer" name="singer" type="text" />
                        </div>
                        <div class="row">
                            <label for="song-url">歌曲链接：</label>
                            <input id="song-url" name="url" type="text" />
                        </div>
                        <div class="row">
                            <input id="submit-button" name="submit-button" type="submit" />
                        </div>
                    </form>
                </div>
                <div class="file-uploader">
                    <div class="file-select-wrap">
                        <input class="file-input" type="file" id="select" />
                        <span>点击或拖拽文件上传</span>
                    </div>
                    <div class="file-info">
                        <ul class="clearfix">
                            <li>FileName：<span id="file-name">__filename__</span></li>
                            <li>Size：<span id="file-size">__size__</span></li>
                            <li>Process：<span id="file-process">_0%_</span></li>
                        </ul>
                        <span class="process-bar></span>
                    </div>
                </div>
            </div>
        `,
        render(data){
            $(this.el).html(this.template);
        }
    };
    let model = {};
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render();
            this.initQiniu(this.createUptoken());
        },
        createUptoken(){
            $.ajax({
                url: 'http://localhost:8888/uptoken',
                success: function(res){
                    var domain = res.domain;
                    var token = res.uptoken;

                    return {token, domain};
                }
            })
        },
        initQiniu(token, domain){
            $("#select").unbind("change").bind("change", function () {
                var file = this.files[0];
                if (file) {
                    var key = file.name;
                    var size = file.size;

                }
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
                        console.log(res)
                    },
                    error(err){
                        console.log(err);
                        alert('上传失败，请重试');
                    },
                    complete(res){
                        var sourceLink = 'http://' + domain + '/' + encodeURIComponent(res.key);
                        console.log(sourceLink)
                        alert('上传成功');
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
        }
    };
    controller.init(view,model);
}