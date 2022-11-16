var http=require('http');
var db = require('./lib/db.js');
var template = require('./template.js');
var urlm = require('url');
var qs = require('querystring');

module.exports = {
    home : function (req, res) {
        db.query(`SELECT * FROM topic`, function(error, topics) {
            var titleoftopic = 'Welcome';
            var description = 'Hello, Node.js';

            var context = {title: titleoftopic,
                        list:topics,
                        control: `<a href="/create">create</a>`,
                        body: `<h2>${titleoftopic}</h2>${description}`
            }; // render 시 ejs 파일에 넘겨줄 값 

            res.app.render('home', context, function(err, html){
                if (err) console.log(err);
                // render 하면서 응답코드 자동 응답
                res.end(html);
            });  
        });
    },

    page : function (req, res) {
        var url = req.url;
        var id = req.params.pageId;
        db.query(`SELECT * FROM topic`, function(error, topics) {
            if (error) {
                throw error;
            }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [id], function(error2, topic) {
                if(error2) { throw error2; }
                var titleoftopic = topic[0].title; 
                var descriptionoftopic =  topic[0].description;
                
                var context = {
                    title:titleoftopic,
                    list: topics,
                    control: `<a href="/create">create</a>
                    <a href="/update/${id}">update</a>
                    <form action="/delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                        <input type="hidden" name="id" value="${id}">
                        <input type="submit" value="delete">
                    </form>`,
                    body: `<h2>${titleoftopic}</h2>
                    ${descriptionoftopic} 
                    <p>by ${topic[0].name}</p>`
                };
               
                res.app.render('home', context, function(err, html) {
                    res.end(html);
                });
            });
        });
    },

    create : function(req, res) {
        db.query(`SELECT * FROM topic`, function (error, topics) {
            db.query(`SELECT * FROM author`, function(error2, authors) {
                var titleofcreate = 'create';

                var context = {
                    title: titleofcreate,
                    list: topics,
                    control: `<a href="/create">create</a>`,
                    body: `<form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p> ${template.authorSelect(authors,'')} </p>
                    <p><input type="submit"></p>
                    </form>`
                };
                res.app.render('home', context, function(err, html) {
                    res.end(html);
                });
            });
        });
    },

    create_process : function(req, res) { // html 문서를 필요로 하지않고 db 접근만 하므로 수정사항 없음
        var body = '';

        req.on('data', function(data) {
            body = body + data;
        });

        req.on('end', function() {
            var post = qs.parse(body);         
            db.query(`
            INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author], function (error, result) { // insert 시 result에 새로 입력한 tuple 
                if (error) { throw error; }
                res.writeHead(302, {Location: `/page/${result.insertId}`});
                res.end();
            });
        });
    },

    update : function(req, res) {
        var url = req.url;
        var id = req.params.pageId;
        db.query(`SELECT * FROM topic`, function(error, topics) {
            if(error) { throw error; }
            db.query(`SELECT * FROM topic WHERE id=?`,[id], function(error2, topic) {
                if(error2) throw error2;
                db.query(`SELECT * FROM author`, function(error3, authors) {
                    var list = template.list(topics);
                    var templ = template.HTML(topic[0].title, list,
                        `
                        <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                        <p>
                        <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                        </p>
                        <p>
                        ${template.authorSelect(authors, topic[0].author_id)}
                        </p>
                        <p>
                        <input type="submit">
                        </p>
                        </form> `,
                        `<a href="/create">create</a> <a href="/update/${topic[0].id}">update</a>`);
                        res.writeHead(200);
                        res.end(templ);
                });
                
            });
        });
    },

    update_process : function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
            [post.title, post.description, post.author, post.id], function (error, result) {
                res.writeHead(302, {Location: `/page/${post.id}`});
                res.end();
            });
        });
    },

    delete_process : function(req, res) {
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
    },
};