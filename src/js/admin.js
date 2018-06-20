var APP_ID = 'oAQybckCEkLQpiP3hTzzha5Y-gzGzoHsz';
var APP_KEY = 'N8wDoIxR9uaRfC8axHhwEAFX';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

$.ajax({
    url: 'http://localhost:8888/uptoken',
    success: function(res){
        var domain = res.domain;
        var token = res.uptoken;
        var putExtra = {
            fname: "",
            params: {},
            mimeType: null
        };
        var config = {
            disableStatisticsReport: false,
            retryCount: 6,
            region: qiniu.region.z1
        };
        uploadWithSDK(token, putExtra, config, domain);
    }
})
function uploadWithSDK(token, putExtra, config, domain){
    $("#select").unbind("change").bind("change", function () {
        var file = this.files[0];
        if (file) {
            var key = file.name;
            var size = file.size;
        }
        var observer = {
            next(res){
                console.log(res)
            },
            error(err){
                console.log(err);
                alert('上传失败，请重试');
            },
            complete(res){
                console.log(res);
                var sourceLink = 'http://' + domain + '/' + encodeURIComponent(res.key);
                console.log(sourceLink)
                alert('上传成功');
            }
        };
        var observable = qiniu.upload(
            file,
            key,
            token,
            putExtra,
            config
        );
        var subscription = observable.subscribe(observer); // 上传开始
    });
}