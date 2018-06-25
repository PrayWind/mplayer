{
    let view = {
        el: '#player',
        render(data){
            let {song, status} = data;
            if($(this.el).find('audio').attr('src') !== song.url){
                let audio = $(this.el).find('audio').attr('src', song.url);
                audio[0].addEventListener('loadedmetadata', (e)=> window.eventHub.emit('getDuration', e.target.duration) );
                audio[0].addEventListener('timeupdate', (e) => window.eventHub.emit('currentTime', e.target.currentTime) );
                audio[0].addEventListener('ended', () => { window.eventHub.emit('songEnd') });
                window.eventHub.on('changeCurrentTime',(currentTime)=>{
                    console.log(currentTime);
                    audio[0].currentTime = currentTime;
                })
            }
            if(status === 'playing'){
                this.playing();
            }else{
                this.paused();
            }
        },
        playing(){
            $(this.el).find('.option-play i').addClass('icon-timeout').removeClass('icon-start');
            $(this.el).find('.record').addClass('rotating');
            $(this.el).find('audio')[0].play()
        },
        paused(){
            $(this.el).find('.option-play i').addClass('icon-start').removeClass('icon-timeout');
            $(this.el).find('.record').removeClass('rotating');
            $(this.el).find('audio')[0].pause();
        },
    };
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: ''
            },
            status: undefined,
        },
    };
    let controlle = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.bindEvents();
            this.bindEventHub();
        },
        bindEvents() {
            $(this.view.el).find('.option-play').on('click', (e)=>{
                e.preventDefault();
                if(this.model.data.status !== 'playing'){
                    this.model.data.status = 'playing';
                }else{
                    this.model.data.status = 'paused'
                }
                this.view.render(this.model.data);
            });

            $(this.view.el).find('.option-songlist').on('click', (e)=>{
                e.preventDefault();
                window.eventHub.emit('openlist');
            });

            $(this.view.el).find('.option-next').on('click', (e)=>{
                e.preventDefault();
                window.eventHub.emit('cutSong','next');
            });

            $(this.view.el).find('.option-prev').on('click', (e)=>{
                e.preventDefault();
                window.eventHub.emit('cutSong','prev');
            });
        },
        bindEventHub(){
            window.eventHub.on('select',(data)=>{
                this.model.data.song = data;
                this.model.data.status = 'playing';
                this.view.render(this.model.data);
            });
            window.eventHub.on('defaultSelect',(data)=>{
                this.model.data.song = data;
                this.view.render(this.model.data);
            });
            window.eventHub.on('songEnd', ()=>{
                this.model.data.status = 'paused';
                this.view.render(this.model.data);
                window.eventHub.emit('cutSong','next');
            })
        }
    };
    controlle.init(view,model);
}