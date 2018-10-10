let events = require('events');
let net = require('net');

let channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

//添加join的事件监听器，保存用户的client对象，以便程序可以将data发送给用户
channel.on('join',function(id,client){
    this.clients[id] = client
    this.subscriptions[id] = function(senderId,message){
        if(id != senderId){
            this.clients[id].write(message)
        }
    }
    this.on('broadcast',this.subscriptions[id])   
})
//创建用户断开连接时的监听器
channel.on('leave',function(id){
    channel.removeListener('broadcast',this.subscriptions[id])
    channel.emit('broadcast',id,id + "has left the room")
})
channel.on('shutdown',function(){
    channel.emit('broadcast','','chat has shut down')
    channel.removeListener('broadcast')
})
//创建server服务器
let server = net.createServer(function(client){
    let id = `${client.remoteAddress}:${client.remotePort}`
    client.on('connect',function(){
        channel.emit('join',id,client)
    })
    client.on('data',function(data){
        data = data.toString()
        if(data == 'shutdown\r\n')
        channel.emit('broadcast',id,data)
    })
})
server.listen(8888)
console.log('run on server 8888')