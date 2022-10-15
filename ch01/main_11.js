// update_process 추가
var http = require('http');
var fs = require('fs');
var urlm = require('url');
var qs = require('querystring');
const port = 3000;
var testFolder = './data';

function templateList(filelist) {
    var list = '<ul>';
                var i = 0;
                while(i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i +1;
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
            <h1><a href='/'>WEB</a></h1>
            ${list}
            ${control}
            ${body}
            </body>
            </html>
    `;
}

var app = http.createServer( function(req, res) {
    var url = req.url;
    var queryData = urlm.parse(url, true).query; 
    /* parse
    true : Object형으로 가져옴 -> 속성명으로 접근 가능해짐
    flase : 문자형으로 가져옴 */

    var pathname = urlm.parse(url, true).pathname; 
    /* 메소드명().속성이름
       : 왼쪽부터 실행(메소드 먼저 실행)후 반환되는 객체의 속성을 의미
    */

    if(pathname == '/') {
        if(queryData.id === undefined){
            fs.readdir(testFolder, function(error, filelist) { 
                var title = 'Welcome';
                var description = 'Hello, Node.js';

                var list = templateList(filelist);
                var template = templateHTML(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`);
             
            res.writeHead(200);
            res.end(template);
            });
        } else { // queryData.id !== undefined
            fs.readdir(testFolder, function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description) {
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,
                `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                res.writeHead(200);
                res.end(template);
            });
        });
    }} else if (pathname === '/create') {
        fs.readdir(testFolder, function(error, filelist) { 
            var title = 'create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
            <form action="http://localhost:${port}/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
            <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            <input type="submit">
            </p>
            </form>
            `);
         
            res.writeHead(200);
            res.end(template);
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
            console.log(title);
            console.log(description);
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                res.writeHead(302, {Location: `/?id=${title}`}); // 
                res.end();
            });
        });
    } else if(pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list,
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
                    res.end(template);
            });
        });
    } else if(pathname === '/update_process') { // 기존 파일을 지우고 새로운 파일을 생성
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            var id = post.id; // 기존 파일명
            var title = post.title; // 새로운 파일명
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                    res.writeHead(302, {Location: `/?id=${title}`});
                    res.end();
                });
            });
        });
    } else { // pathname != '/'
    res.writeHead(404);
    res.end('Not found');}
});
app.listen(port);