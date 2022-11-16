const template = require('./plantemplate.js');
const db = require('./lib/db.js');
var urlm = require('url');
var qs = require('querystring');

module.exports = {
    home : function (req, res) {
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            db.query(`SELECT * FROM author`, function(error, authors) { // author 테이블 조회
                var title = 'author';
                var list = template.List(cals);
                var authorTable = template.authorTable(authors);
                var templ = template.HTML(title, list, 
                    `${authorTable}
                    <style>
                    table { border-collapse: collapse; }
                    td { border: 1px solid black; }
                    </style>
                    <form action="/author/create_process" method="post">
                    <p><input type="text" name="name" placeholder="name"></p>
                    <textarea name="profile" placeholder="description"></textarea><br>
                    <input type="submit" value="create"></button>
                    </form>
                    `,
                    ``);
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
            db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
            [post.name, post.profile], function (error, result) { // result = 새로 입력한 tuple 
                if (error) {
                    throw error;
                }
                res.writeHead(302, {Location: `/author`});
                res.end();
            });
        });
    },

    update: function(req, res) {
        var url = req.url;
        // var queryData = urlm.parse(url, true).query; 
        var id = req.params.pageId;
        db.query(`SELECT * FROM calendar`, function(error, cals) {
            if(error) { throw error; }
            db.query(`SELECT * FROM author WHERE id=?`,[id], function(error2, author) {
                if(error2) throw error2;
                db.query(`SELECT * FROM author`, function(error3, authors) {
                    var title = 'author';
                    var authorTable = template.authorTable(authors);
                    var list = template.List(cals);
                    var templ = template.HTML(title, list,
                        `${authorTable}
                        <style>
                        table { border-collapse: collapse; }
                        td { border: 1px solid black; }
                        </style>
                        <form action="/author/update_process" method="post">
                        <input type="hidden" name="id" value="${id}">
                        <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
                        <p>
                        <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                        </p>
                        <p>
                        <input type="submit" value="update">
                        </p>
                        </form> `,
                        ``);
                        res.writeHead(200);
                        res.end(templ);
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
            db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
            [post.name, post.profile, post.id], function (error, result) {
                res.writeHead(302, {Location: `/author`});
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

            db.query(`DELETE FROM calendar WHERE author_id=?`, [post.id], function(error1, result1) {
                db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    res.writeHead(302, {Location: '/author'});
                    res.end();
                });
            }); 
        });
    },
};