var db = require('./lib/db.js');
var template = require('./template.js');
var urlm = require('url');
var qs = require('querystring');

module.exports = {
    home : function (req, res) {
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
    },

    page : function (req, res) {
        var url = req.url;
        var queryData = urlm.parse(url, true).query; 
        db.query(`SELECT * FROM topic`, function(error, topics) {
            if (error) {
                throw error;
            }

            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic) {
                if(error2) { throw error2; }
                var title = topic[0].title; 
                var description =  topic[0].description;
                var list = template.list(topics);
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
    },

    create : function(req, res) {
        db.query(`SELECT * FROM topic`, function (error, topics) {
            db.query(`SELECT * FROM author`, function(error2, authors) {
                var title = 'create';
                var list = template.list(topics);
                var templ = template.HTML(title, list, `
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    ${template.authorSelect(authors,'')}
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
    },

    create_process : function(req, res) {
        var body = '';

        req.on('data', function(data) {
            body = body + data;
        });

        req.on('end', function() {
            var post = qs.parse(body); 
            // db에 insert           
            db.query(`
            INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author], function (error, result) { // insert 시 result에 새로 입력한 tuple 
                if (error) {
                    throw error;
                }
                res.writeHead(302, {Location: `/?id=${result.insertId}`});
                res.end();
            });
        });
    },

    update : function(req, res) {
        var url = req.url;
        var queryData = urlm.parse(url, true).query; 
        db.query(`SELECT * FROM topic`, [queryData.id], function(error, topics) {
            if(error) { throw error; }
            db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic) {
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
                        `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`);
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
                res.writeHead(302, {Location: `/?id=${post.id}`});
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