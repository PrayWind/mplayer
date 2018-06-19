var APP_ID = 'oAQybckCEkLQpiP3hTzzha5Y-gzGzoHsz';
var APP_KEY = 'N8wDoIxR9uaRfC8axHhwEAFX';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

$.ajax({
    url: 'http://localhost:8888/uptoken',
    success: function(res){
        var token = res.uptoken;
        var putExtra = {
            fname: "",
            params: {},
            mimeType: null
        };
        var config = {
            useCdnDomain: true,
            disableStatisticsReport: false,
            retryCount: 6,
            region: qiniu.region.z1
        };
        uploadWithSDK(token, putExtra, config);
    }
})
function uploadWithSDK(token, putExtra, config){
    $("#select").unbind("change").bind("change", function () {
        var file = this.files[0];
        if (file) {
            var key = file.name;

        }
        var observer = {
            next(res){
                // ...
            },
            error(err){
                alert('上传失败，请重试')
            },
            complete(res){
                alert('上传成功')
            }
        };
        console.log(qiniu.region.z1);
        var observable = qiniu.upload(file, "test", token, putExtra, config);
        var subscription = observable.subscribe(observer); // 上传开始
    });
}