var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var app = express();

var MySqlStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2022'
};
var sessionStore = new MySqlStore(options);

app.use(session({
    secret: 'keyboard cat', // 암호화 키
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

app.use(function(req, res, next) {
    if(!req.session.views) {
        req.session.views={};
    }

    var pathname = parseurl(req).pathname;
    req.session.views[pathname] = (req.session.views[pathname] || 0) +1;
    next();
});

app.get('/', function(req,res,next) {
    console.log(req.session);
    if(req.session.num === undefined) req.session.num = 1;
    else req.session.num +=1;
    res.send(`Hello session: ${req.session.num}`);
});

app.listen(3000, () => console.log('3000'));