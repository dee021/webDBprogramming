// express 사용
var urlm = require('url');
var qs = require('querystring');
var db = require('./lib/db.js');
var topic = require('./topic.js');
var author = require('./author.js');
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    topic.home(req, res);
});

app.get('/page/:pageId', function(req, res){ // pageId는 변수
    topic.page(req, res);
});

app.get('/create', function(req, res) {
    topic.create(req, res);
});

app.post('/create_process', function(req, res) {
    topic.create_process(req, res);
});

app.get('/update/:pageId', function(req, res) {
    topic.update(req, res);
});

app.post('/update_process', function(req, res) {
    topic.update_process(req, res);
});

app.post('/delete_process', function(req, res) {
    topic.delete_process(req, res);
});

app.get('/author', function(req, res) {
    author.home(req, res);
});

app.post('/author/create_process', function(req, res) {
    author.create_process(req, res);
});

app.get('/author/update/:pageId', function(req, res) {
    author.update(req, res);
});

app.post('/author/update_process', function(req, res) {
    author.update_process(req, res);
});

app.post('/author/delete_process', function(req, res) {
    author.delete_process(req, res);
});
app.listen(3000, () => console.log('example app listening on port 3000'));

/* 
var http = require('http');
var urlm = require('url');
var topic = require('./topic.js');
var author = require('./author.js');
const port = 3000;

var app = http.createServer( function(req, res) { 
    var url = req.url;
    var queryData = urlm.parse(url, true).query; 
    var pathname = urlm.parse(url, true).pathname;

    if(pathname == '/') {
        if(queryData.id === undefined){ 
            topic.home(req, res);
        } else { // queryData.id !== undefined
            topic.page(req, res);    
    }} else if (pathname === '/create') {
        topic.create(req,res);
    } else if (pathname === '/create_process') { 
        topic.create_process(req,res);
    } else if(pathname === '/update') {
        topic.update(req, res);
    } else if(pathname === '/update_process') {  
        topic.update_process(req, res);
    } else if (pathname === '/delete_process') {
        topic.delete_process(req, res);
    } else if (pathname === '/author') {
        author.home(req, res);
    } else if (pathname === '/author/create_process') {
        author.create_process(req, res);
    } else if (pathname === '/author/update') {
        author.update(req, res);
    } else if (pathname === '/author/update_process') {
        author.update_process(req, res);
    } else if (pathname === '/author/delete_process') {
        author.delete_process(req, res);
    } else { 
    res.writeHead(404);
    res.end('Not found');}
});
app.listen(port);
 */