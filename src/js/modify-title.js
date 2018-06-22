{
    let view = {
        el: '.main > .title',
        template: `<h2>__title__</h2>`,
        render(data) {
            let html = this.template.replace(`__title__`, data || '添加歌曲');
            $(this.el).html(html)
        }
    };
    let model = {

    };
    let controlle = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEventHub();
        },
        bindEventHub(){
            window.eventHub.on('modifyTitle',(data)=>{
                this.view.render(data);
            })
        }
    };

    controlle.init(view,model);
}