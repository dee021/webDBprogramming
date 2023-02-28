var db = require('./lib/db');
var qs = require('querystring');

function authIsOwner(req, res) {
    if(req.session.is_logined) {
        return true;
    }
    return false;
}

module.exports = {
    login: function(req, res) {
        var subdoc;
        if(authIsOwner(req, res) === true) {
            subdoc = 'home.ejs';
        } else {
            subdoc='login.ejs';
        }

        var context = {doc: subdoc,
            loggined: false,
            id: '',
            cls: '',
            referer: req.header('Referer').split('3000')[1]
            };

    req.app.render('index', context, function(err, html) {
        if(err) console.error(err);
        res.end(html);
    });
    },

    login_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`SELECT loginid, password, class FROM person WHERE loginid = ? and password = ?`,
            [post.id, post.pw], function(error, result) {
                if(error) console.error(error);
                if (result[0] === undefined) {
                    res.end('Who ?');
                } else {
                    req.session.is_logined = true;
                    req.session.login_id = result[0].loginid;
                    req.session.class = result[0].class;
                    res.redirect('/');
                }
            });
        });
    },

    logout: function(req, res) {
        req.session.destroy(function(err) {
            if (err) console.error(err);
            res.redirect('/');
        });
    },

    register: function(req, res) {
        var context = {
            doc: 'register.ejs',
            loggined: authIsOwner(req, res),
            id: req.session.login_id,
            cls:req.session.class,
                };

        req.app.render('index', context, function(err, html) {
            if(err) console.error(err);
            res.end(html);
        });
    },

    register_process: function(req, res) {
        // class, grade : default 값으로 입력 
        //   -> 이후 관리자가 버튼 클릭 시 특정 기간동안 n원 이상 구매자들 등급 올리기 기능 구현
    
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`INSERT INTO person VALUES (?, ?, ?, ?, ?, ?, 'C', 'B')`,
            [post.id, post.pw, post.name, post.address, post.tel, post.birth], function(error, result) {
                if(error) {
                    console.error(error);
                    // 사용자 안내
                } else {
                    req.session.is_logined = true;
                    req.session.login_id = post.id;
                    req.session.class = 'C'
                    res.redirect('/');
                }
            });
        });
    },

    pwchange: function(req, res) {
        db.query(`SELECT password FROM person WHERE loginid = ?`, [req.session.login_id], function(error, result) {
            if(error) console.error(error);
            var context = {
                doc: 'pwchange.ejs',
                loggined: authIsOwner(req, res),
                id: req.session.login_id,
                cls:req.session.class,
                pw: result[0].password
            };
            req.app.render('index', context, function(err, html) {
                if(err) console.error(err);
                res.end(html);
            });
        });
    },

    pwchange_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`UPDATE person SET password=? WHERE loginid=? AND password=?`,
            [post.newpw, req.session.login_id, post.pw], function(error, result) {
                if(error) {
                    console.error(error);
                    // 사용자 안내
                } else {
                    res.redirect('/');
                }
            });
        });
    }


}