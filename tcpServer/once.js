//用once相应单次事件
let net = require('net')
let server = net.createServer(function(socket){
    socket.once('data',function(data){
        socket.write(data)
    })
})
server.listen(8888)