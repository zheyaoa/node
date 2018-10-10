let http = require('http')

let server = http.createServer(function(req,res){
    let body = 'hello world';
    res.setHeader('Content-Length',body.length);
    res.setHeader('Content-Type','text/plain');
    res.end(body)
})

server.listen(3000)