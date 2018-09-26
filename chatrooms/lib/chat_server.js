import socketIo from 'socket.io'
let io;
let guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {},
    chatServer = {}
//确认连接逻辑

chatServer.listen = function(server){
    //启动socket.io 服务器，允许它搭载在已有的http服务器上
    io = socketIo.listen(server)
    io.set('log level',1);
    io.sockets.on('connection',function(socket){
        //在客户连接进时赋予其一个用户名
        guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed)
        //在客户连接上时将他放入聊天室Lobby中
        joinRoom(socket,'Lobby')
        handleMessageBroadcasting(socket,nickNames)
        handleNameChangeAttempts(socket,nickNames,namesUsed)
        handleRoomJoining(socket)
        socket.on('rooms',function () {
            socket.emit('rooms',io.sockets.adapter.rooms)
        });
        handleClientDisconnection(socket,nickNames,namesUsed)
    })
}


//分配用户昵称
let assignGuestName = (socket,guestNumber,nickNames,namesUsed) => {
    //生成新的昵称
    let name = `Guest${guestNumber}`
    //将用户昵称与客户连接id关联上
    nickNames[socket.id] = name
    //让用户知道他自己的昵称
    socket.emit('nameAction',{
        success:true,
        name:name
    });
    //存放已经被占用的昵称
    namesUsed.push(name)
    return guestNumber + 1
}

let joinRoom = (socket,room)=>{
    //让用户加入房间 socket 为用户
    socket.join(room)
    currentRoom[socket.id] = room
    //加入结果
    socket.emit('joinResult',{room:room})
    //让房间里的其他用户知道有新用户加入了房间
    socket.broadcast.to(room).emit('message',{
        text:`${nickNames[socket.id]} has join the room`
    })
    //获取在该房间的所有用户
    let usersInRoom = io.sockets.adapter.rooms[room]
    console.log(usersInRoom)
    console.log(`the length:${Object.keys(usersInRoom).length}`)
    if(Object.keys(usersInRoom).length > 1){
        let usersInRoomSummary = `Users current in ${room} :`
        // usersInRoom.forEach((user) => {
        //     let userSocketId = user.id;
        //     if(userSocketId != socket.id){
        //         usersInRoomSummary += `${nickNames[userSocketId]},`
        //     }
        // });
        for(let id in usersInRoom.sockets){
            console.log(id)
            if(id != socket.id){
                usersInRoomSummary += `${nickNames[id]},`
            }
        }
        socket.emit('message', {text:usersInRoomSummary})
    }
}

//更名请求的逻辑处理
let handleNameChangeAttempts = (socket,nickNames,namesUsed) => {
    socket.on('nameAttempt', function (name) {
        //昵称不能以Guest开头
        if(name.indexOf('Guest') == 0){
            socket.emit('nameResult',{
                success:false,
                message:'name cannot be begin with Guest'
            })
        }else{
            //如果该id尚未被注册
            if(!namesUsed.includes(name)){
                //获取原来的姓名
                let previousName = nickNames[socket.id]
                let previousNameIndex = namesUsed.findIndex(name => {
                    return name == previousName
                })
                namesUsed.push(name)
                nickNames[socket.id] = name
                delete namesUsed[previousNameIndex]
                socket.emit('nameResult',{
                    success:true,
                    name:name
                })
                //向房间里的其他人发送通知
                socket.broadcast.to(currentRoom[socket.id]).emit('message',{
                    text:`${previousName} is now known as ${name} .`
                })
            }else{//该name已被占用
                socket.emit('nameResult',{
                    success:false,
                    message:'That name is already in use'
                })
            }
        }
    })
}

//将一条信息转发给统一房间的所有用户
let handleMessageBroadcasting = (socket,nickNames) => {
    socket.on('message',function(message){
        socket.broadcast.to(message.room).emit('message',{
            text:`${nickNames[socket.id]} : ${message.text}`
        })
    })
}

//创建房间
let handleRoomJoining = (socket) => {
    socket.on('join',function(room){
        socket.leave(currentRoom[socket.id])
        joinRoom(socket,room.newRoom)
    })
}
    
//用户断开连接
let handleClientDisconnection = (socket) => {
    socket.on('disconnect',function(){
        let nameIndex = namesUsed.findIndex(name =>{
            return name == namesUsed[socket.id]
        })
        delete namesUsed[nameIndex]
        delete nickNames[socket.id]
    })
}

export {chatServer}