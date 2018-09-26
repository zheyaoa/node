import http from 'http'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import {chatServer} from './chat_server'
//启动Socket服务器，给他提供已经定义好的http服务器，这样就可以和http服务器共享一个端口

//cache 用于储存缓存文件的内容
let cache = {}

//请求文件不存在发送404请求
function send404(response){
    response.writeHead(200,{"Content-Type":'text/plain'})
    response.write('Error 404:resource not found')
    response.end()
}

//提供文件数据服务
function sendFile(response,filePath,fileContents){
    response.writeHead(
        200,
        {"Content-Type":mime.getType(path.basename(filePath))}
    )
    response.end(fileContents)
}

//提供静态文件服务
function serverStatic(response,cache,absPath){
    //检查静态文件是否缓存在cache中
    if(cache[absPath]){
        sendFile(response,absPath,cache[absPath])
    }else{
        fs.exists(absPath,function(exists){
            //如果存在
            if(exists){
                fs.readFile(absPath,function(err,data){
                    if(err){
                        send404(response)
                    }else{
                        cache[absPath] = data
                        sendFile(response,absPath,data)
                    }
                })
            }else{
                send404(response)
            }
        })
    }
}

//创建http服务器
let server = http.createServer(function(request,response){
    let filePath = false
    if(request.url == '/'){
        filePath = 'public/index.html'
    }else{
        filePath = `public${request.url}`
    }
    let absPath = `./${filePath}`
    serverStatic(response,cache,absPath)
})
server.listen(3000,function(){
    console.log('server listening on port 3000')
})

chatServer.listen(server)