var qs = require('querystring');
var db = require('./lib/db.js');

function authIsOwner(req, res) {
    if(req.session.is_logined) {
        return true;
    }
    return false;
}

module.exports= {
    namecardHome : function (req, res) {
        db.query(`SELECT * FROM namecard`, function(error, result) {
            if (error) throw error;
            temlogin = true;
            var context = {
                doc: './namecard/namecard.ejs',
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
             cls:req.session.class,
                results: result
            };

            res.app.render('index', context, function(err, html){
                if (err) console.error(err);
                // render 하면서 응답코드 자동 응답
                res.end(html);
            });  
        });
    },

    namecardCreate: function(req, res) {
        var titleofcreate = 'Create';
        var context = {
            doc: './namecard/namecardCreate.ejs',
            title: '',
            description: '',
            kindOfDoc: 'C',
            loggined:authIsOwner(req, res),
                id: req.session.login_id,
             cls:req.session.class,
        };
        res.app.render('index', context, function(err, html) {
            if(err) console.error(err);
            res.end(html);
        });
    },

    namecardCreate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var card = qs.parse(body);
            db.query(`INSERT INTO namecard (title, description, created, author_id) VALUES(?, ?, NOW(), 2)`,
            [card.title, card.description], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: `/namecard`});
                res.end();
            });
        });
    },

    namecardList: function(req, res) {
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM namecard`, function(error, result) {
            if (error) throw result;
            var context = {
                doc: `./namecard/namecardList.ejs`,
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
             cls:req.session.class,
                results: result
            };
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    namecardUpdate: function(req, res) {
        var titleofcreate = 'Update';
        var cardId = req.params.cardId;

        db.query(`SELECT * FROM namecard WHERE id= ${cardId}`, function(error, result) {
            if (error) throw error;
            var context = {
                 doc: './namecard/namecardCreate.ejs',
                title: result[0].title,
                description: result[0].description,
                pId: cardId,
                kindOfDoc: 'U',
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
             cls:req.session.class
            };
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    namecardUpdate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var card = qs.parse(body);
            cardId = req.params.cardId;
            db.query(`UPDATE namecard SET title=?, description=?, author_id=? WHERE id=?`,
             [card.title, card.description, 2,cardId], function(error, result) {
                if (error) throw error;
                    res.writeHead(302, {Location: `/namecard`});
                    res.end();
             });
        });
    },

    namecardDelete_process: function(req, res) {
        var cardId = req.params.cardId;
        db.query(`DELETE FROM namecard WHERE id=?`, [cardId], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: '/namecard'});
                res.end();
        });
    },

    search: function(req, res) {
        var context = {
            doc: './search.ejs',
            listyn : 'N',
            kind: 'Namecard',
            path: 'namecard',
            loggined: authIsOwner(req, res),
            id: req.session.login_id,
            cls:req.session.class,
            results: ''
        };

        if (req.method === 'POST') {
            var body='';
            req.on('data', function(data) {
                body = body + data;
            })
            req.on('end', function() {
                var post = qs.parse(body);
                db.query(`SELECT * FROM namecard WHERE title like ?`, [`%${post.keyword}%`], 
                function(error, results) {
                    if (error) console.error(error);
                    context.listyn = 'Y';
                    context.results = results;

                    req.app.render('index', context, function(err, html) {
                        if (err) console.error(err);
                        res.end(html);
                    });
                });
            });
        } else {
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        }
    },
};