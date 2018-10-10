let net = require('net')
let server = net.createServer(function(socket){
    socket.on('data',function(data){
        socket.write(data)
    })
})
server.listen(8888)
console.log('you server is run on 8888');
