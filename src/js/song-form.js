{
    let view = {
        el: '.page > main',
        template: `
            <div class="title">
                <h2>编辑歌曲信息</h2>
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
            // this.view.render();
        }
    };
    controller.init(view,model);
}