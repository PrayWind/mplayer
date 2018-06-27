{
    let view = {
        el: '#player',
        render(data){
            let {song, status} = data;
            if($(this.el).find('audio').attr('src') !== song.url){
                let audio = $(this.el).find('audio').attr('src', song.url);
                if(song.cover){
                    let coverImg = document.createElement('img');
                    $(coverImg).attr('src', song.cover);
                    $(this.el).find('.cover').append(coverImg);
                }
                audio[0].addEventListener('loadedmetadata', (e)=> window.eventHub.emit('getDuration', e.target.duration) );
                audio[0].addEventListener('ended', () => { window.eventHub.emit('songEnd') });
                let record = $(this.el).find('.record');
                $(this.el).find('.cover-wrap').empty().append(record);
            }
            window.eventHub.on('changeCurrentTime', (currentTime)=> {
                if(song.lyrics && song.lyrics.length > 10) this.showLycics(currentTime);
                $(this.el).find('audio')[0].currentTime = currentTime
            });
            $(this.el).find('audio')[0].addEventListener('timeupdate', (e) => {
                if(song.lyrics && song.lyrics.length > 10) this.showLycics(e.target.currentTime);
                window.eventHub.emit('currentTime', e.target.currentTime)
            } );

            if(status === 'playing'){
                this.playing();
            }else{
                this.paused();
            }

            let {lyrics} = song;
            $(this.el).find('.lyric > .lyric-inner').empty();
            $(this.el).find('.lyric').height( $(this.el).find(".cover-wrap").height() );
            if(lyrics){
                lyrics.split('\n').map((string)=>{
                    let p = document.createElement('p');
                    let regex = /\[([\d:.]+)\](.+)/;
                    let matches = string.match(regex);
                    if(matches){
                        p.textContent = matches[2];
                        let time = matches[1];
                        let parts = time.split(':');
                        let minutes = parts[0];
                        let seconds = parts[1];
                        let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds, 10);
                        p.setAttribute('data-time', newTime)
                    }else{
                        p.textContent = string
                    }
                    $(this.el).find('.lyric>.lyric-inner').append(p)
                });
            }else{
                let p = document.createElement('p');
                $(p).text("此歌曲暂没有歌词");
                $(this.el).find('.lyric>.lyric-inner').append(p)
            }
        },
        showLycics(time){
            let allLines = $(this.el).find('.lyric>.lyric-inner p');
            let line;
            for(let i = 0; i < allLines.length; i++){
                if(i === allLines.length-1){
                    line = allLines[i];
                    break
                }else {
                    let currentTime = allLines.eq(i).attr('data-time');
                    let nextTime = allLines.eq(i+1).attr('data-time');
                    if(currentTime <= time && nextTime > time){
                        line = allLines[i];
                        break
                    }
                }
            }
            $(line).addClass('active').siblings().removeClass('active');
            let lineTop = line.getBoundingClientRect().top;
            let warpTop = $(this.el).find('.lyric>.lyric-inner')[0].getBoundingClientRect().top;
            let top = warpTop - lineTop;
            $(this.el).find('.lyric>.lyric-inner').css("transform",`translateY(${top}px)`);
        },
        playing(){
            $(this.el).find('.option-play i').addClass('icon-timeout').removeClass('icon-start');
            $(this.el).find('.record').addClass('play');
            $(this.el).find('audio')[0].play()
        },
        paused(){
            $(this.el).find('.option-play i').addClass('icon-start').removeClass('icon-timeout');
            $(this.el).find('.record').removeClass('play');
            $(this.el).find('audio')[0].pause();
        },
    };
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                cover: '',
                lyrics: ''
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