let http = require('http')

let server = http.createServer(function(req,res){
    res.end('hello world')
})

server.listen(3000)