// 모듈화
const http = require('http');
const urlm = require('url');
const calendar = require('./calendar.js');
const author = require('./planauthor.js');
const express = require('express');
const app = express();


app.get('/', (req, res) => calendar.home(req, res));
app.get('/page/:pageId', (req, res) => calendar.page(req, res));
app.get('/create', (req, res) => calendar.create(req, res));
app.post('/create_process', (req, res) => calendar.create_process(req, res));
app.get('/update/:pageId', (req, res) => calendar.update(req, res));
app.post('/update_process', (req, res) => calendar.update_process(req, res));
app.post('/delete_process', (req, res) => calendar.delete_process(req, res));
app.get('/author', (req, res) => author.home(req, res));
app.post('/author/create_process', (req, res) => author.create_process(req, res));
app.get('/author/update/:pageId', (req, res) => author.update(req, res));
app.post('/author/update_process', (req, res) => author.update_process(req, res));
app.post('/author/delete_process', (req, res) => author.delete_process(req, res));

app.listen(3000, () => console.log('port 3000'));
/* var app = http.createServer((req, res) => {
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
app.listen(3000); */