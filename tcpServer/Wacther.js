//拓展时间监听器,创建Ｗatcher类
let events= require('events'),
    util = require('util'),
    fs =  require('fs')

function Wacther(watchDir,processDir){
    this.watchDir = watchDir
    this.processDir = processDir
}
util.inherits(Wacther,events.EventEmitter)
//等同于　Ｗacther.prototype = new events.EventEmitter()
let watchDir = './watch',
    processDir = './done'

Wacther.prototype.watch = function(){
    let watcher = this
    fs.readdir(this.watchDir,function(err,files){
        if(err){
            throw err
        }
        for(let file of files){
            watcher.emit('process',file)
        }
    })
}
Wacther.prototype.start = function(){
    let watcher = this
    /**
     * watchFile 监视文件，监视到文件发生修改时进行处理
     */
    fs.watchFile(watchDir,function(){
        watcher.watch()
    })
}

//构造实例对象ｗatcher
let watcher = new Wacther(watchDir,processDir)
watcher.on('process',function(file){
    let watchFile = this.watchDir + '/' + file
    let processFile = this.processDir + '/' + file.toLowerCase()
    fs.rename(watchFile,processFile,function(err){
        if(err) throw err
    })
})

watcher.start();


