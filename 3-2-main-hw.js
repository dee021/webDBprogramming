const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const urlm = require('url');
const port = 3000;

function templateHTML(list, control, title, body) {
    return `
    <!doctype html>
    <html>
    <head>
    <meta charset='utf-8'>
    <title>NameCard</title>
    </head>
    <body>
    <h1><a href="/namecard">NameCard-홈페이지</a></h1>
    <hr>
    ${list}
    ${control}
    <h2>${title}</h2>
    ${body}
    </body>
    </html>
    `;
}

function templateList(filelist) {
    var list = '<ol>';
    for (var i = 0; i < filelist.length; i++) {
        list += `<li><a href="/namecard?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list += '</ol>';
    return list;
}

function deleteClick() {
    document.getElementById
}

const app = http.createServer(function(req, res) {
    var url = req.url;
    var queryData = urlm.parse(url, true).query;
    var pathname = urlm.parse(url, true).pathname; 

    if (pathname === '/') {
        res.writeHead(302, {Location: `/namecard`});
        res.end();
    } else if (pathname === '/namecard') {
        if (queryData.id === undefined) {
            fs.readdir('./namecard', (error, filelist) => {
                var list = templateList(filelist);
                var control = `<button type="button" onclick="location.href='/namecard/create'">생성</button>`;
                var title = '이름을 클릭하세요';
                var body = '목록에서 이름을 클릭하면 상세내용이 나옵니다.';
    
                var template = templateHTML(list, control, title, body);
            
                res.writeHead(200);
                res.end(template);
            });
        } else { // queryData.id !== undefined
            fs.readdir('./namecard', (error, filelist) => {
                fs.readFile(`./namecard/${queryData.id}`, 'utf-8', function(err, body) {
                    var list = templateList(filelist);
                    var title = queryData.id;
                    var control = `
                    <button type="button" onclick="location.href='/namecard/create'">생성</button>
                    <button type="button" onclick="location.href='/namecard/update?id=${title}'">수정</button>
                    <button type="button" onclick="if(confirm('정말로 삭제하시겠습니까?')) location.href='delete_process?id=${title}'">삭제</button>`;
                    var template = templateHTML(list, control, title, body);
    
                    res.writeHead(200);
                    res.end(template);
                });
            });
        }  
    } else if (pathname === '/namecard/create') {
        fs.readdir('./namecard', (error, filelist) => {
            var list = templateList(filelist);
            var control = `<button type="button" onclick="location.href='/namecard'">홈페이지로가기</button>`;
            var body = `<form action="/create_process" method="post">
            <input type="text" name="name" placeholder="이름"><br><br>
            <textarea name="content" cols="50" rows="10" placeholder="내용"></textarea><br><br>
            <input type="submit" value="생성">
            <form>
            `;

            var template = templateHTML(list, control, '', body);
        
            res.writeHead(200);
            res.end(template);
        });
    } else if (pathname === '/create_process') {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', function() {
            var msg = qs.parse(body);
            var title = msg.name;
            var content = msg.content;
            fs.writeFile(`./namecard/${title}`, content, 'utf8', function (error) {
                res.writeHead(302, {Location: encodeURI(`/namecard?id=${title}`)});
                res.end();
            });
        });
    } else if (pathname === '/namecard/update') {
        fs.readdir('./namecard', (error, filelist) => {
            fs.readFile(`./namecard/${queryData.id}`, 'utf8', function(err, content) {
                var list = templateList(filelist);
                var control = `<button type="button" onclick="location.href='/namecard/create'">생성</button>`;
                var title = '';
                var body = `<form action="/update_process" method="post">
                <input type="hidden" name="name" value="${queryData.id}">
                <input type="text" name="newname" placeholder="이름" value="${queryData.id}"><br><br>
                <textarea name="content" cols="50" rows="10" placeholder="내용">${content}</textarea><br><br>
                <input type="submit" value="수정">
                <form>
                `;
                var template = templateHTML(list, control, title, body);

                res.writeHead(200);
                res.end(template);
            });
        });
    } else if (pathname === '/update_process') {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', function() {
            var msg = qs.parse(body);
            var title = msg.name;
            var name = msg.newname;
            var content = msg.content;
            fs.rename(`./namecard/${title}`, `./namecard/${name}`, function(err) {
                fs.writeFile(`./namecard/${name}`, content, 'utf8', function (error) {
                    res.writeHead(302, {Location: encodeURI(`/namecard?id=${name}`)});
                    res.end();
                });
            });
        });
    } else if (pathname === '/delete_process') {
        var id = queryData.id;
        fs.unlink(`./namecard/${id}`, function(error) {
            res.writeHead(302, {Location: '/namecard'});
            res.end();
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
app.listen(port, () => {console.log(`http://localhost:${port} 대기중`);});