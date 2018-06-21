var http = require('http');
var fs = require('fs');
var url = require('url');
var port = process.argv[2];
var qiniu = require('qiniu')

if(!port){
    console.log('请指定端口号');
    process.exit(1)
}

var server = http.createServer(function(request, response){

    var temp = url.parse(request.url, true);
    var path = temp.pathname;
    var query = temp.query;
    var method = request.method;

    /******** 从这里开始看，上面不要看 ************/

    if(path==='/uptoken'){
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/json;charset=utf-8');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.removeHeader('Date');

        var config = fs.readFileSync('./qiniu-key.json');
        config = JSON.parse(config);

        let {accessKey, secretKey} = config;
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var options = {
            scope: 'music',
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken = putPolicy.uploadToken(mac);
        response.write(`{
        "uptoken": "${uploadToken}",
        "domain": "paj0x8dsg.bkt.clouddn.com"
        }`);
            response.end()
    }else{
        response.statusCode = 404;
        response.write('找不到对应的路径');
        response.end()
    }

});

server.listen(port);
console.log('监听 ' + port + ' 成功\n请用浏览器打开 http://localhost:' + port);
