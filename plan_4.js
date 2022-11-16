// db화
const http = require('http');
const fs = require('fs');
const urlm = require('url');
const qs = require('querystring');
const path = require('path');
// const sanitizeHtml = require('sanitize-html');
const tem = require('./plantemplate.js');
const mysql = require('mysql');

var db = mysql.createConnection({
    host:'localhost',
    user:'nodejs',
    password:'nodejs',
    database:'webdb2022'
});
db.connect();

var app = http.createServer((req, res) => {
    var url = req.url;
    var queryData = urlm.parse(url, true).query;
    var pathname = urlm.parse(url, true).pathname;

    if (pathname === '/'){
        if (queryData.id === undefined){
            db.query(`SELECT * FROM calendar`, function(error, cals) {
                var title = '월별 계획';
                var description = '월을 클릭해 주세요';
                var list = tem.List(cals);
                
                var template = tem.HTML(title, list, description, '<a href="/create">create</a>');
                
                res.writeHead(200);
                res.end(template);
            });
        } else { // queryData.id !== undefined
            db.query(`SELECT * FROM calendar`, function(error, cals) {
                if (error) throw error;
                db.query(`SELECT * FROM calendar WHERE title=?`, [queryData.id], function(error2, cal) {
                    if (error2) throw error2;
                    var title = queryData.id + ' 월';
                    var description = cal[0].description;
                    var list = tem.List(cals);
                
                    var template = tem.HTML(title, list, description, `
                    <a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                    </form>
                    `);
                
                    res.writeHead(200);
                    res.end(template);
                }); 
            });
        }
    } else if(pathname === '/create'){
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            if (error) throw error;
            var title = 'WEB - create';
                var description = `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="month"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                <input type="submit">
                </p>
                </form>`;
                var list = tem.List(cals);
                
                var template = tem.HTML(title, list, description, '<a href="/create">create</a>');
                
                res.writeHead(200);
                res.end(template);
        });
    } else if (pathname === '/create_process'){
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`INSERT INTO calendar (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, 1], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: `/?id=${post.title}`});
                res.end();
            });
        });
    } else if (pathname === '/update') {
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            if(error) throw error;
            db.query(`SELECT * FROM calendar WHERE title=?`, [queryData.id], function(error2, cal) {
                if (error2) throw error2;
                var title = queryData.id + ' 월';
                var list = tem.List(cals);
                var template = tem.HTML(title, list, 
                    `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${cal[0].title}">
                    <p><input type="text" name="title" placeholder="title" value="${cal[0].title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${cal[0].description}</textarea>
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${cal[0].title}">update</a>`
                    );
                    res.writeHead(200);
                    res.end(template);
            });
        });
    } else if (pathname === '/update_process') {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`UPDATE calendar SET title=?, description=?, author_id=1 WHERE title=?`,
             [post.title, post.description, post.id], function(error, result) {
                if (error) throw error;
                    res.writeHead(302, {Location: `/?id=${post.title}`});
                    res.end();
             });
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`DELETE FROM calendar WHERE title=?`, [post.id], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: '/'});
                res.end();
            });
        });
    } else { // pathname !== '/'
        res.writeHead(404);
        res.end('Not Found');
    }
});
app.listen(3000);