const db = require('./lib/db');
var qs = require('querystring');

function authIsOwner(request, response){
    if(request.session.is_logined){
        return true;
    } else {
        return false;
    }
}

function dateOfEightDigit(){
    var today = new Date();
    var nowdate = String(today.getFullYear());
    var month ;
    var day ;
    if (today.getMonth() < 9)
        month = "0" + String(today.getMonth()+1);
    else
        month = String(today.getMonth()+1);
    if (today.getDate() < 10)
        day = "0" + String(today.getDate());
    else
        day = String(today.getDate());
       
    return nowdate + month + day;
}

module.exports = {
    list : function(request,response){
        db.query(`SELECT count(*) as total FROM board`,function(error, nums){
            if (error) console.error(error);
            var numPerPage = 2;
            var pageNum = request.params.pNum;
            var offs = (pageNum-1)*numPerPage;
            var totalPages = Math.ceil(nums[0].total / numPerPage);

            db.query(`SELECT * FROM board ORDER BY date desc, id LIMIT ? OFFSET ?`, [numPerPage, offs],function(error, boards) {
                if(error) {
                    console.error(error);
                }
                var context = {doc : `./board/boardlist.ejs`,
                            cls : request.session.class,
                            loggined : authIsOwner(request, response),
                            id : request.session.login_id,
                            kind : '게시판',
                            board : boards,
                            pageNum : pageNum,
                            totalpages : totalPages
                            };
                request.app.render('index',context, function(err, html){
                    if (err) console.error(err);
                    response.end(html); })  
            });
        })
    },

    view : function(request,response){
        var bNum = request.params.bNum;
        var pNum = request.params.pNum;

        db.query(`SELECT *  FROM board WHERE id = ? `,[bNum],function(error, board){
                if(error) {
                    console.error(error);
                }
                var context = {doc : `./board/boardview.ejs`,
                            cls : request.session.class,
                            loggined : authIsOwner(request, response),
                            id : request.session.login_id,
                            kind : '게시물 내용',
                            pageNum : pNum,
                            board : board
                            };
                request.app.render('index',context, function(err, html){
                    if (err) console.error(err);
                    response.end(html); })  
           
        })
    },
    create : function(request,response){
            db.query(`SELECT *  FROM person WHERE loginid = ? `,[request.session.login_id],function(error, person){
                if(error) {
                    throw error;
                }
                var context = {doc : `./board/boardcreate.ejs`,
                            cls : request.session.class,
                            loggined : authIsOwner(request, response),
                            id : request.session.login_id,
                            title : '',
                            content : '',
                            boardid : '',
                            name : person[0].name,
                            pNum : '',
                            kind : 'C'
                            };
                request.app.render('index',context, function(err, html){
                    if(err) console.error(err);
                    response.end(html); });  
            });  
    },
    create_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`
                INSERT INTO board (loginid, name, date, content, title)
                    VALUES(?, ?, ?, ?, ?)`,
                [post.id, post.nmh, dateOfEightDigit(),post.content, post.title], function(error, result) {
                    if(error) {console.error(error);}
                    response.writeHead(302, {Location: `/board/list/1`});
                    response.end();
                }
            );
        });
    },
    update : function(request, response) {
        var bNum = request.params.bNum;
        var pNum = request.params.pNum;
        db.query(`SELECT *  FROM person WHERE loginid = ? `,[request.session.login_id],function(error, person){
            db.query(`SELECT * FROM board WHERE id= ?`,[bNum],function(error,board){
                if(error) {
                    throw error;
                }
                var context = {doc : `./board/boardcreate.ejs`,
                            cls : request.session.class,
                            loggined : authIsOwner(request, response),
                            id : request.session.login_id,
                            title : board[0].title,
                            content : board[0].content,
                            boardid : bNum,
                            name : person[0].name,
                            pNum : pNum,
                            kind : 'U'
                            };
                request.app.render('index',context, function(err, html){
                    response.end(html); });  
            });  
        });
    },
    update_process : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query('UPDATE board SET title=?, content=?, date=? WHERE id=?',
                [post.title, post.content, dateOfEightDigit(), post.boardid], function(error, result) {
                response.writeHead(302, {Location: `/board/view/${post.boardid}/${post.pNum}`});
                response.end();
            });
        });
    },
    delete : function(request, response) {
        var bNum = request.params.bNum;
        var pNum = request.params.pNum;
        db.query('DELETE FROM board WHERE id = ?', [bNum], function(error, result) {
            if(error) {console.error(error);}
            response.writeHead(302, {Location: `/board/list/${pNum}`});
            response.end();
        });
    }
}
