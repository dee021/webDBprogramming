// table join : 글과 작성자 조인
var http = require('http');
var fs = require('fs');
var urlm = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
const port = 3000;
var testFolder = './data';
var template = require('./template_2.js'); 
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
        if(queryData.id === undefined){ // 메인화면에서 작성자를 볼 필요가 없으므로 넘어감
            db.query(`SELECT * FROM topic`, function(error, topics) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                var templ = template.HTML(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`);
                res.writeHead(200);
                res.end(templ);
            });
        } else { // queryData.id !== undefined
            db.query(`SELECT * FROM topic`, function(error, topics) {
                if (error) {
                    throw error;
                }
                // join하여 select
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic) {
                    if(error2) { throw error2; }
                    
                    // db에서 읽어온 자료를 보여줌 
                    var title = topic[0].title; 
                    var description =  topic[0].description;
                    var list = template.list(topics);

                    // description 아래 저자 표시
                    var templ = template.HTML(title, list, 
                        `<h2>${title}</h2>
                        ${description}
                        <p>by ${topic[0].name}</p>`,
                        `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                </form>`);
                    res.writeHead(200);
                    res.end(templ);
                });
            });

          
    }} else if (pathname === '/create') {
        db.query(`SELECT * FROM topic`, function (error, topics) {
            // 작성자 목록을 가져오기
            db.query(`SELECT * FROM author`, function(error2, authors) {

                // <select> option 생성
                var tag = '';
                var i = 0;
                while(i < authors.length ) {
                    tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
                    i++;
                }

                var title = 'create';
                var list = template.list(topics);

                // <textarea> 아래에 작성자 선택항목 넣음
                var templ = template.HTML(title, list, `
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <select name="author">
                        ${tag}
                    </select>
                </p>
                <p>
                <input type="submit">
                </p>
                </form>
                `, `<a href="/create">create</a>`);
             
                res.writeHead(200);
                res.end(templ);
            });
        });
            
        
    } else if (pathname === '/create_process') { 
        var body = '';

        req.on('data', function(data) {
            body = body + data;
        });

        req.on('end', function() {
            var post = qs.parse(body); 
            // db에 insert           
            db.query(`
            INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, 1], function (error, result) { // insert 시 result에 새로 입력한 tuple 
                if (error) {
                    throw error;
                }
                res.writeHead(302, {Location: `/?id=${result.insertId}`});
                res.end();
            });
        });
    } else if(pathname === '/update') {
        // 해당 레코드의 id만 필요하므로 공격 위험성x -> path.parse() 불필요
        db.query(`SELECT * FROM topic`, [queryData.id], function(error, topics) {
            if(error) { throw error; }
            db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic) {
                if(error2) throw error2;
                
                var list = template.list(topics);
                var templ = template.HTML(topic[0].title, list,
                    `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                    </p>
                    <input type="submit">
                    </p>
                    </form> `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`);
                    res.writeHead(200);
                    res.end(templ);
            });
        });
    } else if(pathname === '/update_process') {  // title, description, author_id만 수정
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`,
            [post.title, post.description, post.id], function (error, result) {
                res.writeHead(302, {Location: `/?id=${post.id}`});
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

            db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result) {
                if(error) {
                    throw error;
                }
                res.writeHead(302, {Location: '/'});
                res.end();
            });
        });        
    } else { // pathname != '/'
    res.writeHead(404);
    res.end('Not found');}
});
app.listen(port);