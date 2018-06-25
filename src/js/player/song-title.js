{
    let view = {
        el: '#player>.song-title',
        template: `
            <h1>{{name}}</h1>
            <span class="singer">{{singer}}</span>
        `,
        render(data = {}){
            let placeholder = ['name', 'singer'];
            let html = this.template;
            placeholder.map((string)=>{
                html = html.replace(`{{${string}}}`, data[string] || '')
            });
            $(this.el).html(html);
            return data;
        },
    };
    let model = {
        data: {}
    };
    let controlle = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindEventHub();
        },
        bindEventHub(){
            window.eventHub.on('defaultSelect', (data)=>{
                this.model.data = data;
                this.view.render(data);
            })
            window.eventHub.on('select', (data)=>{
                this.model.data = data;
                this.view.render(data);
            })
        }
    };

    controlle.init(view,model);
}
