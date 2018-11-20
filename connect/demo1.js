let connect = require('connect');
let logger =  (req,res,next) => {
    console.log('%s %s',req.method,req.url);
    next();
}
let admin = (req,res,next) => {
    switch(req.url){
        case '/':
            res.end('try/user');
            break;
        case '/users':
            res.setHeader('Content-Type','application/json');
            res.write(JSON.stringify(['tobi','loki','jane']));
            break;
    }
    next();
}
connect()
    .use(admin)
    .use(logger)
    .listen(3000)