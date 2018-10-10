let fs = require('fs'),
    request = require('request'),
    htmlparser = require('htmlparser');
let configFilename = '/rss_feeds.txt';

//确保包含RSS订阅源URL列表的文件存在
function checkForRssFile() {
    fs.exists(configFilename,function(exists){
        if(!exists){
            return next(new Error('Missing RSS file: ' + configFilename))
        }
        //错误则返回
        next(null,configFilename)
    })
}

//读取并解析包含订阅源URL的文件
function readRSSFile (configFilename) {
    fs.readFile(configFilename,function(err,feedList){
        if(err) return next(err);
        feedList = feedList.toString().replace(/^\s+|\s+$/g,'').split("\n")
        let random = Math.floor(Math.random*feedList.length);
        next(null,feedList[random])
    })
}

//向选定的预定源发送http请求以获取数据
function downloadRSSFeed (feedUrl) {
    request({uri:feedUrl},function(err,res,body){
        if (err) return next(err)
        if (res.statusCode != 200) 
            return next(new Error('Abnormal response status code'))
        next(null,body)
    })
}

//将预定源数据解析到一个条目数组中
function parseRSSFeed (rss) {
    let handler = new htmlparser.RssHandler();
    let parser = new htmlparser.Parser()
    parser.parseComplete(rss)
    if(!handler.dom.items.length){
        return next(new Error('NO RSS items found'))
    }
    let item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}


//把所有要做的目标保存在一个数组中
let tasks = [ checkForRssFile,
              readRSSFile,
              downloadRSSFeed,
              parseRSSFeed  ];

function next(err,result) {
    if(err) throw err;
    let currentTask = tasks.shift();
    if(currentTask) {
        currentTask(result);
    }
} 

next()