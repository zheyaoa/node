let fs = require('fs')
let url = require('url')
let path = require('path')
let http = require('http')

//从命令行参数获取根目录
let root = path.resolve(process.argv[2] || './public')
console.log(url)
//创建服务器
let server = http.createServer(function(request,response){
    //获取url的path,类似于'/css/boostrap.css
    let pathname = url.parse(request.url).pathname

    //获得对应的本地文件path
    let filepath = path.join(root,pathname)
    console.log(pathname)
    console.log(filepath);    
    // 获取文件状态:
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没有出错并且文件存在:
            console.log('200 ' + request.url);
            // 发送200响应:
            response.writeHead(200);
            // 将文件流导向response:
            fs.createReadStream(filepath).pipe(response);
        } else {
            // 出错了或者文件不存在:
            console.log('404 ' + request.url);
            // 发送404响应:
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
})
server.listen(8080)

console.log('Server is running at http://127.0.0.1:8080/');