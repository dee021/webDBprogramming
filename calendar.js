const http = require('http');
const tem = require('./plantemplate.js');
const db = require('./lib/db.js');
var urlm = require('url');
var qs = require('querystring');

module.exports = {
    home: function(req, res) {
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            var title = '월별 계획';
            var description = '월을 클릭해 주세요';
            var list = tem.List(cals);
            
            var template = tem.HTML(title, list, description, '<a href="/create">create</a>');
            
            res.writeHead(200);
            res.end(template);
        });
    },

    page: function(req, res) {
        var url = req.url;
    // var queryData = urlm.parse(url, true).query;
    var id = req.params.pageId;
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            if (error) throw error;
            db.query(`SELECT * FROM calendar LEFT JOIN author ON calendar.author_id=author.id WHERE title=?`, [id], function(error2, cal) {
                if (error2) throw error2;
                var title = id + ' 월';
                var description = `${cal[0].description}
                <p>by ${cal[0].name}</p>`;
                var list = tem.List(cals);
            
                var template = tem.HTML(title, list, description, `
                <a href="/create">create</a>
                <a href="/update/${id}">update</a>
                <form action="/delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                <input type="hidden" name="id" value="${id}">
                <input type="submit" value="delete">
                </form>
                `);
            
                res.writeHead(200);
                res.end(template);
            }); 
        });
    },

    create: function(req, res) {
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            db.query(`SELECT * FROM author`, function(error2, authors) {
                if (error) throw error;
            var title = 'WEB - create';
                var description = `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="month"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>${tem.authorSelect(authors, '')}</p>
                <p>
                <input type="submit">
                </p>
                </form>`;
                var list = tem.List(cals);
                
                var template = tem.HTML(title, list, description, '<a href="/create">create</a>');
                
                res.writeHead(200);
                res.end(template);
            });
        });
    },

    create_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`INSERT INTO calendar (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: `/page/${post.title}`});
                res.end();
            });
        });
    },

    update: function(req, res) {
        var url = req.url;
    // var queryData = urlm.parse(url, true).query;
    var id = req.params.pageId;
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            if(error) throw error;
            db.query(`SELECT * FROM calendar WHERE title=?`, [id], function(error2, cal) {
                if (error2) throw error2;
                db.query(`SELECT * FROM author`, function(error3, authors) {
                    var title = id + ' 월';
                    var list = tem.List(cals);
                    var template = tem.HTML(title, list, 
                        `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${cal[0].title}">
                        <p><input type="text" name="title" placeholder="title" value="${cal[0].title}"></p>
                        <p>
                        <textarea name="description" placeholder="description">${cal[0].description}</textarea>
                        </p>
                        <p>${tem.authorSelect(authors, cal[0].author_id)}
                        <p>
                        <input type="submit">
                        </p>
                        </form>`,
                        `<a href="/create">create</a> <a href="/update/${cal[0].title}">update</a>`
                        );
                        res.writeHead(200);
                        res.end(template);
                });
            });
        });
    },

    update_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`UPDATE calendar SET title=?, description=?, author_id=? WHERE title=?`,
             [post.title, post.description, post.author,post.id], function(error, result) {
                if (error) throw error;
                    res.writeHead(302, {Location: `/page/${post.title}`});
                    res.end();
             });
        });
    },

    delete_process: function(req, res) {
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
    }
};