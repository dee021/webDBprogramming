// db 모듈화
// 라우트 제외 기능을 topic 으로 모듈화
var http = require('http');
var urlm = require('url');
const port = 3000;
var topic = require('./topic.js');

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
    } else { 
    res.writeHead(404);
    res.end('Not found');}
});
app.listen(port);