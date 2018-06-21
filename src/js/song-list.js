{
    let view = {
        el: '.songlist-container',
        template: `
            <ul>
                <li><span class="song-name">__songname__</span><span class="singer">__singer__</span></li>
            </ul>
        `,
        render(data) {
            $(this.el).html(this.template)
        }
    };
    let model = {

    };
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            view.render()
        }
    };

    controller.init(view,model);
}