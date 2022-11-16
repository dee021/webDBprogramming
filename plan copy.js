// 모듈화
const http = require('http');
const urlm = require('url');
const calendar = require('./calendar.js');
const author = require('./planauthor.js');

var app = http.createServer((req, res) => {
    var url = req.url;
    var queryData = urlm.parse(url, true).query;
    var pathname = urlm.parse(url, true).pathname;

    if (pathname === '/'){
        if (queryData.id === undefined){
            calendar.home(req, res);
        } else { // queryData.id !== undefined
            calendar.page(req, res);
        }
    } else if(pathname === '/create'){
        calendar.create(req, res);
    } else if (pathname === '/create_process'){
        calendar.create_process(req, res);
    } else if (pathname === '/update') {
        calendar.update(req, res);
    } else if (pathname === '/update_process') {
        calendar.update_process(req, res);
    } else if (pathname === '/delete_process') {
        calendar.delete_process(req, res);
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
        res.end('Not Found');
    }
});
app.listen(3000);