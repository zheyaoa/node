let http = require('http')
let url = require('url')
let items = []

let server = http.createServer(function(req,res){
    switch(req.method){
        case 'POST':
            let item = '';
            req.setEncoding('utf8');
            //只要读入了新的数据亏
            req.on('data',function(chunk){
                item += chunk;
            })
            req.on('end',function(){
                items.push(item)
            })
            break;
        case 'GET':
            items.forEach((item,i)=>{
                res.write(i+')' + item + '\n');
            })
            res.end();
            break;
    }
})

server.listen(3000)