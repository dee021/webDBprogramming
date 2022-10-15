// db 연결
var http = require('http');
var fs = require('fs');
var urlm = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
const port = 3000;
var testFolder = './data';
var template = require('./template.js'); 
var mysql = require('mysql');

// db 연결
var db = mysql.createConnection({ 
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2022'
});
db.connect();

var app = http.createServer( function(req, res) { 
    var url = req.url;
    var queryData = urlm.parse(url, true).query; 
    var pathname = urlm.parse(url, true).pathname;

    if(pathname == '/') {
        if(queryData.id === undefined){ // db에서 조회
            db.query(`SELECT * FROM topic`, function(error, topics) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(filelist);
                var templ = template.HTML(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`);
                // console.log(topics);
                res.writeHead(200);
                res.end(templ);
            });
        } else { // queryData.id !== undefined
            db.query(`SELECT * FROM topic`, function(error, topics) {
                if (error) {
                    throw error;
                }
                db.query(`SELECT * FROM topic WHERE id=${queryData.id}`, function(error2, topic) {
                    if(error2) { throw error2; }
                    console.log(topic); // 배열 구조
                    
                    // db에서 읽어온 자료를 보여줌 
                    var title = topic[0].title; 
                    var description =  topic[0].description;
                    var list = template.list(filelist);
                    var templ = template.HTML(title, list, 
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a>`);
                    res.writeHead(200);
                    res.end(templ);
                });
            });

            fs.readdir(testFolder, function(error, filelist) {
                var filterId = path.parse(queryData.id).base; // 경로의 base 부분만 받아옴
            fs.readFile(`data/${filterId}`, 'utf-8', function(err, description) { // queryData.id -> filterId 변경
                
                
                
                
                var title = filterId;

                var sanitizedTitle = sanitizeHtml(title); // 
                var sanitizedDescription = sanitizedHtml(description, {
                    allowTags: ['hi']
                });

                var list = template.list(filelist);
                var templ = template.HTML(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                `<a href="/create">create</a>
                <a href="/update?id=${title}">update</a>
                <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>`); 
                res.writeHead(200);
                res.end(templ);
            });
        });
    }} else if (pathname === '/create') {
        fs.readdir(testFolder, function(error, filelist) { 
            var title = 'create';
            var list = template.list(filelist);
            var templ = template.HTML(title, list, `
            <form action="http://localhost:${port}/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
            <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            <input type="submit">
            </p>
            </form>
            `, `<a href="/create">create</a>`);
         
            res.writeHead(200);
            res.end(templ);
        });
    } else if (pathname === '/create_process') { 
        var body = '';
        
        req.on('data', function(data) {
            body = body + data;
        });

        req.on('end', function() {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                res.writeHead(302, {Location: `/?id=${title}`}); // 
                res.end();
            });
        });
    } else if(pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id;
                var list = template.list(filelist);
                var templ = template.HTML(title, list,
                    `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <input type="submit">
                    </p>
                    </form> `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                    res.writeHead(200);
                    res.end(templ);
            });
        });
    } else if(pathname === '/update_process') { 
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            var id = post.id; 
            var title = post.title; 
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                    res.writeHead(302, {Location: `/?id=${title}`});
                    res.end();
                });
            });
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });

        req.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(error) {
                res.writeHead(302, {Location: '/'});
                res.end();
            }); 
        });        
    } else { // pathname != '/'
    res.writeHead(404);
    res.end('Not found');}
});
app.listen(port);