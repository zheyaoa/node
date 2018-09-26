class Chat{
    constructor(socket){
        this.socket = socket
    }
    //发送消息
    sendMessage(room,text){
        let message = {
            room:room,
            text:text
        }
        this.socket.emit('message',message)
    }
    //变更房间
    changeRoom(room){
        this.socket.emit('join',{
            newRoom:room
        })
    }
    //处理聊天命令
    processCommand(form){
        let words = form.split(' ')
        let command = words[0].substring(1,words[0].length).toLowerCase()
        let message = false
        //处理不同的命令
        switch(command){
            //处理房间的变换创建
            case 'join':
                words.shift()
                let room = words.join(' ')
                this.changeRoom(room)
                break
            case 'nick':
                words.shift()
                let name = words.join(' ')
                this.socket.emit('nameAttempt',name)
                break
            default:
                message = 'Unrecognized command'
                break        
        }
        return message
    }
}
