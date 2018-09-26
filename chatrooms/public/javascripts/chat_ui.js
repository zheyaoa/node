let divEscapedContentElement = (message) => {
    return $('<div></div>').text(message)
}
let divSystemContentElement = (message) =>{
    return $('<div></div>').html('<i>' + message +'</i>')
}

//处理用户的原始输入
let processUserInput = (chatApp) => {
    let message = $('#send-message').val()
    let systemMessage;
    //若开头为'/'则视为聊天命令
    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message)
        if(systemMessage){
            $('message').append(divSystemContentElement(message))  
        }
    }else{
        console.log(`submit message:${message}`)
        chatApp.sendMessage($('#room').text(),message);
        $('#messages').append(divEscapedContentElement(message))
        $('#messages').scrollTop($('#message').prop('scrollHeight'))
    }
    $('#send-message').val('')
}

$(document).ready(function(){
    let socket = io.connect()
    let chatApp = new Chat(socket)
    //尝试改名的结果反馈
    socket.on('nameResult',function(result){
        let message;
        if(result.success){
            console.log(result)
            message = `You are known as ${result.name} .`
        }else{
            message = result.message
        }
        $('#messages').append(divSystemContentElement(message))
    })
    //显示房间变更结果
    socket.on('joinResult',function(result){
        $('#room').text(result.room)
        $('#messages').append(divSystemContentElement('Room Changed.'))
    })
    //显示接受到的信息
    socket.on('message',function(message){
        let newElement = $('<div></div>').text(message.text)
        $('#messages').append(newElement)
    })
    //显示可用的房间列表
    socket.on('rooms',function(rooms){
        $('room-list').empty()
        for(let room in rooms){
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room))
            }
        }
        //点击房间名切换到那个房间中
        $('#room-list div').click(function(){
            chatApp.processCommand(`/join ${$(this).text()}`)
            $('#send-message').focus()
        })
    })

    setTimeout(function(){
        socket.emit('rooms')
    },1000)

    $('#send-message').focus()
    $('#send-button').click(function(){
        console.log('submit')
        processUserInput(chatApp,socket)
        return false
    })

})