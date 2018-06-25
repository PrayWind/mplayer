{
    let view = {
        el: '.process',
        render(data){
            let times = data;
            $(this.el).find('.current').text(times.currentTime);
            $(this.el).find('.process-play').css({"transform": "translateX(" + times.process + "%)"});
        },
    };
    let model = {
        times: {
            durationTime: '',
        }
    };
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.bindEvents();
            this.bindEventHub();
        },
        bindEvents(){
            $(this.view.el).find('.process-bar').on('click',(e)=>{
                let schedule = Math.floor((e.pageX-e.currentTarget.parentNode.offsetLeft) / e.currentTarget.offsetWidth * 100);
                if(schedule>=100){
                    schedule = 100
                }else if(schedule<=0){
                    schedule = 0
                }
                let currentTime = this.model.times.durationTime * schedule / 100;
                window.eventHub.emit('changeCurrentTime', currentTime);
            });
        },
        bindEventHub(){
            window.eventHub.on('currentTime',(curtime)=>{
                let currentTime = this.formatTime(curtime);
                let process = curtime / this.model.times.durationTime *100;
                this.view.render({currentTime,process});
            });
            window.eventHub.on('getDuration', (durTime)=>{
                this.model.times.durationTime = durTime;
                let times = this.formatTime(durTime);
                $(this.view.el).find('.total').text(times);
            })
        },
        formatTime(time){
            let times = Math.round(time);
            let minute, second;
            if(times>=60){
                minute = Math.floor(times / 60);
                if(minute<10) minute = "0"+minute;
                second = times % 60;
                if(second<10) second = "0"+second
            }else{
                minute = "00";
                second = times;
                if(second<10) second = "0"+second
            }
            times = minute + ":" + second;
            return times;
        }
    };

    controller.init(view,model)
}
