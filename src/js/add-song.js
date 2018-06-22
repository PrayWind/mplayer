{
    let view = {
        el: '#add-song-btn',
        template: `添加歌曲`,
        render(data) {
            $(this.el).html(this.template)
        }
    };
    let model = {

    };
    let controlle = {
        init(view,model){
            this.view = view;
            this.model = model;
            view.render();
            this.bindevent();
        },
        bindevent(){
            $(view.el).on('click',()=>{
                window.eventHub.emit('render-upload', {})
            })
        }
    };

    controlle.init(view,model);
}