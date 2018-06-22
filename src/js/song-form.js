{
    let view = {
        el: '.page > main .song-info',
        template: `
            <form>
                <div class="row">
                    <label for="song-name">歌曲标题：</label>
                    <input id="song-name" name="name" type="text" value="__name__" required/>
                </div>
                <div class="row">
                    <label for="song-singer">歌&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手：</label>
                    <input id="song-singer" name="singer" type="text" value="__singer__" required/>
                </div>
                <div class="row">
                    <label for="song-url">歌曲链接：</label>
                    <input id="song-url" name="url" type="text" value="__url__" required/>
                </div>
                <div class="row">
                    <input id="submit-button" name="submit-button" type="submit" />
                </div>
            </form>
        `,
        render(data = {}){
            let placeholder = ['name', 'singer', 'url'];
            let html = this.template;
            placeholder.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            });
            $(this.el).html(html);
        }
    };
    let model = {
        data:{
            name: '', singer:'', url:'', id: ''
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong) => {
                let {id, attributes} = newSong;
                Object.assign(this.data = {id, ...attributes });
            }, (errer) => {
                console.log(errer);
            })
        }
    };
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindevent();
            this.bindEventHub();
        },
        bindevent(){
            $(this.view.el).on('submit','form', (e) => {
                e.preventDefault();
                let needs = 'name singer url'.split(' ');
                let data = {};
                needs.map((string)=>{
                    data[string] = $(this.view.el).find(`[name="${string}"]`).val();
                });
                this.model.create(data).then(()=>{
                    this.view.render({});
                    let string = JSON.stringify(this.model.data);
                    let object = JSON.parse(string);
                    window.eventHub.emit('create', object);
                    window.location.reload()
                });
            })
        },
        bindEventHub(){
            window.eventHub.on('renderForm', (data)=>{
                this.view.render(data)
            });
            window.eventHub.on('select', (data)=>{
                this.view.render(data)
            })
        }
    };
    controller.init(view,model);
}