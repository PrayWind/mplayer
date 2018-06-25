{
    let view = {
        el: '.songlist-container',
        $mask: $('.mask'),
        $list: $('#songlist'),
        template: `
            <ul class="songlist-ul">
            </ul>
        `,
        render(data) {
            $(this.el).html(this.template);

            let {songs, currentPlayId} = data;
            if(!currentPlayId){
                currentPlayId = songs[songs.length-1].id
            }
            let liList = songs.map((song) => {
                let nameSpan = $('<span></span>').addClass('song-title').text(song.name);
                let singerSpan = $('<span></span>').addClass('singer').text(song.singer);
                let $li = $('<li></li>').append(nameSpan).append(singerSpan).attr('data-song-id', song.id);

                if(song.id === currentPlayId){
                    this.activeItem($li);
                }

                return $li;
            });
            $(this.el).find('ul').empty();

            liList.map((domLi)=>{
                $(this.el).find('ul').prepend(domLi);
            });
        },
        activeItem(li){
            let $li = $(li);
            $li.addClass('active').siblings().removeClass('active');
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active');
        },
        openlist(){
            this.$mask.addClass('active');
            this.$list.addClass('active');
        },
        closelist(){
            this.$list.removeClass('active');
            this.$mask.removeClass('active');
        }
    };
    let model = {
        data:{
            songs:[ ],
            currentPlayId: undefined,
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then( (songs) => {
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes}
                });

                return songs;
            })
        }
    };
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.getSongs();
            this.bindEventHub();
            this.bindEvents();

        },
        getSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data);
                this.defaultSelect();
            });
        },
        bindEventHub(){
            window.eventHub.on('openlist', ()=>{
                this.view.openlist();
            });
        },
        defaultSelect(){
            let currentPlayId = this.model.data.currentPlayId;
            let songs = this.model.data.songs;
            if(!this.model.currentPlayId){
                currentPlayId = songs[songs.length-1].id;
            }
            let data = songs[songs.length-1];
            data = JSON.parse(JSON.stringify(data));
            window.eventHub.emit('select', data);
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songId = e.currentTarget.getAttribute('data-song-id');
                this.model.data.currentPlayId = songId;
                this.view.render(this.model.data);
                let data;
                let songs = this.model.data.songs;
                for(let i = 0; i < songs.length; i++){
                    if(songs[i].id === songId){
                        data = songs[i];
                        break
                    }
                }
                data = JSON.parse(JSON.stringify(data));
                window.eventHub.emit('select', data);
            });
            this.view.$mask.on('click', () => this.view.closelist() );
        },
    };

    controller.init(view,model);
}