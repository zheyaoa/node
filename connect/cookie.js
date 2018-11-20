const connect = require('connect');
const cookieParser = require('cookie-parser')
const app = connect()
    .use(cookieParser())
    .use((req,res) => {
        console.log(req.cookies);
        console.log(req.signedCookies);
        res.setHeader('Set-Cookie','name=yyx');
        res.setHeader('Set-Cookie','age=20');
        res.end('hello\n')
    })
    .listen(3000)