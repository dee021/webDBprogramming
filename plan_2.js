const http = require('http');
const fs = require('fs');
const urlm = require('url');
const qs = require('querystring');

function templateList(filelist) {
    var list = '<ul>';
                var i =0;
                while (i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]} 월</a></li>`;
                    i = i + 1;
                }
                list = list + '</ul>';
    return list;
}

function templateHTML(title, list, body, control) {
    return `
    <!doctype html>
    <html><head>
            <title>WEB1 - ${title}</title>
            <meta charset='utf-8'></head>
            <body>
            <h1><a href='/'>1년 연중 일정 및 계획</a></h1>
            ${list}
            ${control}
            <h2>${title}</h2>
            ${body}
            </body>
            </html>
    `;
}

var app = http.createServer((req, res) => {
    var url = req.url;
    var queryData = urlm.parse(url, true).query;
    var pathname = urlm.parse(url, true).pathname;

    if (pathname === '/'){
        if (queryData.id === undefined){
            fs.readdir('./plandata', function(err, filelist) {
                var title = '월별 계획';
                var description = '월을 클릭해 주세요';
                var list = templateList(filelist);
                var template = templateHTML(title, list, description, '<a href="/create">create</a>');
                
                res.writeHead(200);
                res.end(template);
            });
        } else { // queryData.id !== undefined
            fs.readdir('./plandata', function(err, filelist) {
                var list = templateList(filelist);
                fs.readFile(`plandata/${queryData.id}`, 'utf-8', function(err, description) {
                    
                var title = queryData.id + ' 월';
                var template = templateHTML(title, list, description, 
                    `<a href="/create">create</a>
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
        fs.readdir('./plandata', function(error, filelist) {
            var title = 'WEB - create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="month"></p>
            <p>
            <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            <input type="submit">
            </p>
            </form>`,
            '<a href="/create">create</a>');
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
            var title = post.title;
            var description = post.description;
            fs.writeFile(`plandata/${title}`, description, 'utf8', function(err) {
                res.writeHead(302, {Location: `/?id=${title}`});
                res.end();
            });
        });
    } else if (pathname === '/update') {
        fs.readdir('./plandata', function(error, filelist) {
            fs.readFile(`plandata/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id + ' 월';
                var list = templateList(filelist);
                var template = templateHTML(title, list, 
                    `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <p><input type="text" name="title" placeholder="title" value="${queryData.id}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a>`
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
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`plandata/${id}`, `plandata/${title}`, function(error) {
                fs.writeFile(`plandata/${title}`, description, 'utf8', function(err) {
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
            fs.unlink(`plandata/${id}`, function(error) {
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