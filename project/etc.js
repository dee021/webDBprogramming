var qs = require('querystring');
var db = require('./lib/db.js');

function authIsOwner(req, res) {
    if(req.session.is_logined) {
        return true;
    }
    return false;
}

module.exports= {
    calendarHome : function (req, res) {
        db.query(`SELECT * FROM calendar`, function(error, result) {
            if (error) throw error;
            var context = {
                doc: './calendar/calendar.ejs',
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

    calendarCreate: function(req, res) {
        var titleofcreate = 'Create';
        var context = {
            doc: './calendar/calendarCreate.ejs',
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

    calendarCreate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var cal = qs.parse(body);
            db.query(`INSERT INTO calendar (title, description, created, author_id) VALUES(?, ?, NOW(), 2)`,
            [cal.title, cal.description], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: `/calendar`});
                res.end();
            });
        });
    },

    calendarList: function(req, res) {
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM calendar`, function(error, result) {
            if (error) throw result;
            var context = {
                doc: `./calendar/calendarList.ejs`,
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

    calendarUpdate: function(req, res) {
        var titleofcreate = 'Update';
        var planId = req.params.planId;

        db.query(`SELECT * FROM calendar WHERE id= ${planId}`, function(error, result) {
            if (error) throw error;
            var context = {
                 doc: './calendar/calendarCreate.ejs',
                title: result[0].title,
                description: result[0].description,
                pId: planId,
                kindOfDoc: 'U',
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
             cls:req.session.class,
            };
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    calendarUpdate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var plan = qs.parse(body);
            planId = req.params.planId;
            db.query(`UPDATE calendar SET title=?, description=?, author_id=? WHERE id=?`,
             [plan.title, plan.description, 2, planId], function(error, result) {
                if (error) throw error;
                    res.writeHead(302, {Location: `/calendar`});
                    res.end();
             });
        });
    },

    calendarDelete_process: function(req, res) {
        var planId = req.params.planId;
        db.query(`DELETE FROM calendar WHERE id=?`, [planId], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: '/calendar'});
                res.end();
        });
    },

    search: function(req, res) {
        var context = {
            doc: './search.ejs',
            listyn : 'N',
            kind: 'Calendar',
            path: 'calendar',
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
                db.query(`SELECT * FROM calendar WHERE title like ?`, [`%${post.keyword}%`], 
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