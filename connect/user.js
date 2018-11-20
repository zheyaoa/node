let connect = require('connect');
let router = require('./routes.js');

let  routers = {
    GET:{
        '/users':(req,res) => {
            res.end('tobi,loki,ferret');
        },
        '/users/:id':(req,res,id) => {
            res.end('user' + id);
        }
    },
    DELETE:{
        '/user/:id':(req,res,id) => {
            res.end('delete user' + id);
        }
    }
}
connect()
    .use(router(routers))
    .listen(3000)