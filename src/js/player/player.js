{
    let view = {
        el: '#player',
        render(data){
            let {song, status} = data;
            if($(this.el).find('audio').attr('src') !== song.url){
                let audio = $(this.el).find('audio').attr('src', song.url);
                audio.onended = ()=>{ window.eventHub.emit('songEnd') }
            }
            if(status === 'playing'){
                this.playing();
            }else{
                this.paused();
            }

            setTimeout(()=>{
                let currentTime = $(this.el).find('audio')[0].currentTime;
                let duration = $(this.el).find('audio')[0].duration;
                window.eventHub.emit('songTime',{currentTime,duration})
            }, 500)
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
                console.log('结束');
                this.model.data.status = 'paused';
                this.view.render(this.model.data)
            })
        }
    };
    controlle.init(view,model);
}