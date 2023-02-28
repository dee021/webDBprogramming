var qs = require('querystring');
var db = require('./lib/db.js');

function authIsOwner(req, res) {
    if(req.session.is_logined) {
        return true;
    }
    return false;
}

module.exports= {
    userHome : function (req, res) {
        db.query(`SELECT * FROM person`, function(error, result) {
            if (error) throw error;
            temlogin = true;
            var context = {
                doc: './user/user.ejs',
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
                cls:req.session.class,
                results: result
            };

            res.app.render('index', context, function(err, html){
                if (err) console.error(err);
                res.end(html);
            });  
        });
    },

    userCreate: function(req, res) {
        var titleofcreate = 'Create';
        var context = {
            doc: './user/userCreate.ejs',
            loginid: '',
            pw: '',
            name: '',
            addr: '',
            tel: '',
            birth: '',
            usercls: '',
            grd: '',
            kindOfDoc: 'C',
            loggined:authIsOwner(req, res),
            id: req.session.login_id,
            cls:req.session.class
        };
        res.app.render('index', context, function(err, html) {
            if(err) console.error(err);
            res.end(html);
        });
    },

    userCreate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`INSERT INTO person VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [post.loginid, post.pw, post.name, post.addr, post.tel, post.birth, post.cls, post.grd],
            function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: `/user`});
                res.end();
            });
        });
    },

    userList: function(req, res) {
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM person`, function(error, result) {
            if (error) throw result;
            var context = {
                doc: `./user/userList.ejs`,
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
             cls:req.session.class,
                results: result
            };
            res.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    userUpdate: function(req, res) {
        var titleofcreate = 'Update';
        var userId = req.params.userId;

        db.query(`SELECT * FROM person WHERE loginid='${userId}'`, function(error, result) {
            if (error) throw error;
            var context = {
                doc: './user/userCreate.ejs',
                loginid: result[0].loginid,
                pw: result[0].password,
                name: result[0].name,
                addr: result[0].address,
                tel: result[0].tel,
                birth: result[0].birth,
                usercls: result[0].class,
                grd: result[0].grade,
                pId: userId,
                kindOfDoc: 'U',
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
             cls:req.session.class
            };
            res.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    userUpdate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            userId = req.params.userId;
            db.query(`UPDATE person SET loginid=?, password=?, name=?, address=?, tel=?, birth=?, class=?, grade=? WHERE loginid=?`,
             [post.loginid, post.pw, post.name, post.addr, post.tel, post.birth, post.cls, post.grd, userId], function(error, result) {
                if (error) throw error;
                    res.writeHead(302, {Location: `/user`});
                    res.end();
             });
        });
    },

    userDelete_process: function(req, res) {
        var userId = req.params.userId;
        db.query(`DELETE FROM person WHERE loginid=?`, [userId], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: '/user'});
                res.end();
        });
    }
};