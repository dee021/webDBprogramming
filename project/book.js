const db = require('./lib/db');
const qs = require('querystring');

function authIsOwner(req, res) {
    if(req.session.is_logined) {
        return true;
    }
    return false;
}

function dateOfEightDigit(){
    var today = new Date();
    var nowdate = String(today.getFullYear());
    var month;
    var day;
    if (today.getMonth < 9) month = "0" + String(today.getMonth() +1);
    else month = String(today.getMonth() +1);

    if (today.getDate() < 10) day = "0" + String(today.getDate());
    else day = String(today.getDate());

    return nowdate+month+day;
}

module.exports = {
    home: function(req, res) {
        db.query(`SELECT count(*) as total FROM book`, function(error1, nums) {
            var numPerPage = 4;
            var pageNum = req.params.pNum;
            var offs = (pageNum - 1) * numPerPage;
            var totalPages = Math.ceil(nums[0].total / numPerPage);

            db.query(`SELECT * FROM book LIMIT ? OFFSET ?`, [numPerPage, offs], function(error2, results) {
                if(error2) console.error(error2);
                var context = {
                    doc: './book/book.ejs',
                    kind: 'Book',
                    loggined: authIsOwner(req, res),
                    id: req.session.login_id,
                    cls:req.session.class,
                    results: results,
                    pageNum: pageNum,
                    totalpages: totalPages
                };
        
                req.app.render('index', context, function(err, html) {
                    if (err) console.error(err);
                    res.end(html);
                });
            });
        });
    },

    detail: function(req, res) {
        var bookid = req.params.bookId;
        var pageNum = req.params.pNum;
        db.query(`SELECT * FROM book WHERE id=${bookid}`, function(error, result) {
            var context = {
                doc: './book/bookdetail.ejs',
                bookid: bookid,
                name: result[0].name,
                publisher: result[0].publisher,
                author: result[0].author,
                stock: result[0].stock,
                pubdate: result[0].pubdate,
                ISBN: result[0].ISBN,
                ebook: result[0].ebook,
                kdc: result[0].kdc,
                img: result[0].img,
                price: result[0].price,
                nation: result[0].nation,
                description: result[0].description,
                kindOfDoc: 'C',
                loggined:authIsOwner(req, res),
                id: req.session.login_id,
                cls:req.session.class
            };
            res.app.render('index', context, function(err, html) {
                if(err) console.error(err);
                res.end(html);
            });
        });
    },

    best: function(req, res) {
        db.query(`SELECT * FROM book B join (SELECT * FROM (
            SELECT bookid, count(bookid) as numOfSeller 
            FROM purchase group by bookid order by count(bookid) desc ) A
        LIMIT 3) S on B.id = S.bookid`, function (error, results) {
            if (error) console.error(error);
            var context = {
                doc: './book/book.ejs',
                kind: 'Best Seller',
                loggined: authIsOwner(req, res),
                id: req.session.login_id,
                cls:req.session.class,
                results: results,
                totalpages: 1
            };
    
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    monbook: function(req, res) {
        db.query(`SELECT * FROM book B join (SELECT * FROM (
        SELECT bookid, count(bookid) as numOfSeller FROM purchase 
        WHERE left(purchasedate, 6)=? group by bookid order by count(bookid) desc )
        A LIMIT 3) S on B.id = S.bookid`, [dateOfEightDigit().substring(0,6)],
            function (error, results) {
                if (error) console.error(error);
                var context = {
                    doc: './book/book.ejs',
                    kind: '이달의 책',
                    loggined: authIsOwner(req, res),
                    id: req.session.login_id,
                    cls:req.session.class,
                    results: results,
                    totalpages: 1
                };
    
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    ebook: function(req, res) {
        db.query(`SELECT count(*) as total FROM book WHERE ebook='Y'`, function(error, nums) {
            var numPerPage = 4;
            var pageNum = req.params.pNum;
            var offs = (pageNum - 1) * numPerPage;
            var totalPages = Math.ceil(nums[0].total / numPerPage);

            db.query(`SELECT * FROM book WHERE ebook='Y' LIMIT ? OFFSET ?`, 
            [numPerPage, offs], function(error, results) {
                if(error) console.error(error);
                var context = {
                    doc: './book/book.ejs',
                    kind: 'eBook',
                    loggined: authIsOwner(req, res),
                    id: req.session.login_id,
                    cls:req.session.class,
                    results: results,
                    pageNum : pageNum,
                    totalpages : totalPages
                };
        
                req.app.render('index', context, function(err, html) {
                    if (err) console.error(err);
                    res.end(html);
                });
            });
        });
    },

    cart: function(req, res) {
        if (!authIsOwner(req, res)) {
            res.write("<script>window.location=\"../login\"</script>");
        }

        db.query(`SELECT B.cartid, B.bookid, A.img, A.name, A.author, A.price, B.qty, B.cartdate, A.stock FROM book A JOIN cart B ON B.bookid = A.id WHERE B.custid = ?`,
        [req.session.login_id], function(error, results) {
            if (error) console.error(error);
            var context = {
                doc: './book/cart.ejs',
                loggined: authIsOwner(req, res),
                id: req.session.login_id,
                cls:req.session.class,
                results: results
            };

            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
    },

    cartCreate_process: function(req, res) {
        var body='';
        req.on('data', function(data) {
            body = body + data;
        })
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`INSERT INTO cart (custid, bookid, cartdate, qty) VALUES(?, ?, ?, ?)`,
            [req.session.login_id, post.bookid, dateOfEightDigit(), post.qty], function(error, result) {
                if (error) console.error(error);
                res.writeHead(302, {Location: `/cart`});
                res.end();
            });
        });
    },

    cartDelete_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        })
        req.on('end', function() {
            var post = qs.parse(body);
            console.log(post.cartid);
            console.log(typeof(post.cartid));
            var i =0;
            var sqlArr = [];
            if (typeof(post.cartid) === 'string') sqlArr.push(post.cartid);
            else {
            while (i<post.cartid.length) {
                sqlArr.push([post.cartid[i]]);
                i++;
            }
        }
            db.query(`DELETE FROM cart WHERE cartid=?`,sqlArr, function(error, result) {
                if(error) console.error(error);
                res.writeHead(302, {location: `/cart`});
                res.end();
            });
        });
    },

    purchase_process : function(req, res) {
        var body='';
        req.on('data', function(data) {
            body = body + data;
        })
        req.on('end', function() {
            var post = qs.parse(body);
            var referer = req.header('Referer').split('3000')[1];

            if (req.session.class === 'C') { // 고객이 주문
                var referer = req.header('Referer').split('3000')[1]

                db.query(`INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [req.session.login_id, post.bookid, dateOfEightDigit(), post.price*post.qty, Math.floor(post.price*post.qty*0.01), post.qty],
                function(error, result) {
                if (error) console.log(error);
                db.query(`UPDATE book SET stock=stock-? WHERE id =?`, [post.qty, post.bookid],
                function(error2, result2) {
                   if (error2) console.error(error2);
                if (referer === '/cart') { // cart에서 구매
                    db.query(`DELETE FROM cart WHERE cartid = ${post.cartid}`, function(error3, result2) {
                        if (error3) console.error(error3);
                        res.writeHead(302, {Location: `/purchase`});
                        res.end();
                    });
                } else { 
                           res.writeHead(302, {Location: `/purchase`});
                           res.end();
                       
                }
            });
        });}
    });
    },

    purchase: function(req, res) { // list
        if (!authIsOwner(req, res)) {
            res.write("<script>window.location=\"../login\"</script>");
        } else {
            if(req.session.class === 'C') {
        db.query(`SELECT A.purchaseid, A.bookid, B.img, B.name, B.author, B.price as perPrice, A.price, A.qty, A.cancel, A.refund
        FROM book B join purchase A on B.id = A.bookid WHERE A.custid=? ORDER BY A.purchasedate desc`,
        [req.session.login_id], function (error, results) {
            if (error) console.error(error);
            
            var context = {
                doc: './book/purchase.ejs',
                kind : '구매 내역',
                loggined: authIsOwner(req, res),
                id: req.session.login_id,
                cls:req.session.class,
                results: results
            };
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
        } else { // admin
            db.query(`SELECT A.purchaseid, A.custid, B.img, B.name, B.author, B.price as perPrice, A.price, A.qty, A.cancel, A.refund
        FROM book B join purchase A on B.id = A.bookid ORDER BY A.purchasedate desc`,
        [req.session.login_id], function (error, results) {
            if (error) console.error(error);
            var context = {
                doc: './book/purchase.ejs',
                kind: '주문 내역',
                loggined: authIsOwner(req, res),
                id: req.session.login_id,
                cls:req.session.class,
                results: results
            };
    
            req.app.render('index', context, function(err, html) {
                if (err) console.error(err);
                res.end(html);
            });
        });
        }}
    },

    purchase_cancel : function(req, res) {
        var body='';
        req.on('data', function(data) {
            body = body + data;
        })
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`UPDATE purchase SET cancel='Y', point=0 WHERE purchaseid=${post.purid}`, function(error, result) {
                if (error) throw error;
                db.query(`UPDATE book SET stock=stock+(SELECT qty FROM purchase WHERE purchaseid=${post.purid}) WHERE id = ${post.bookid}`,
                 function(err, result2) {
                    if (err) throw err;
                    res.writeHead(302, {Location: `/purchase`});
                    res.end();
                });
            });
        });
    },

    purchase_refund: function(req, res) {
        var body='';
        req.on('data', function(data) {
            body = body + data;
        })
        req.on('end', function() {
            var post = qs.parse(body);
            db.query(`UPDATE purchase SET refund='Y', price=0 WHERE purchaseid=${post.purid}`, function(error, result) {
                if (error) console.error(error);
                res.writeHead(302, {Location: `/purchase`});
                res.end();
            });
        });
    },

    search: function(req, res) {
        var context = {
            doc: './book/search.ejs',
            listyn : 'N',
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
                db.query(`SELECT * FROM book WHERE name like ?`, [`%${post.keyword}%`], 
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

    bookCreate: function(req, res) {
        var titleofcreate = 'Create';
        var context = {
            doc: './book/bookCreate.ejs',
            name: '',
            publisher: '',
            author: '',
            stock: '',
            pubdate: '',
            pagenum: '',
            ISBN: '',
            ebook: '',
            kdc: '',
            img: '',
            price: '',
            nation: '',
            description: '',
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

    bookCreate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            if (post.img == '') post.img = '/images/default.jpg'
            db.query(`INSERT INTO book (name, publisher, author, stock, pubdate, pagenum, ISBN, ebook, kdc, img, price, nation, description) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [post.name, post.publisher, post.author, post.stock, post.pubdate, post.pagenum, post.ISBN, post.ebook, post.kdc, post.img, post.price, post.nation, post.description], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: `/`});
                res.end();
            });
        });
    },

    bookList: function(req, res) {
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM book`, function(error, result) {
            if (error) throw result;
            var context = {
                doc: `./book/bookList.ejs`,
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

    bookUpdate: function(req, res) {
        var titleofcreate = 'Update';
        var bookId = req.params.bookId;

        db.query(`SELECT * FROM book WHERE id= ${bookId}`, function(error, result) {
            if (error) throw error;
            var context = {
                doc: './book/bookCreate.ejs',
                pId: bookId,
                name: result[0].name,
                publisher: result[0].publisher,
                author: result[0].author,
                stock: result[0].stock,
                pubdate: result[0].pubdate,
                pagenum: result[0].pagenum,
                ISBN: result[0].ISBN,
                ebook: result[0].ebook,
                kdc: result[0].kdc,
                img: result[0].img,
                price: result[0].price,
                nation: result[0].nation,
                description: result[0].description,
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

    bookUpdate_process: function(req, res) {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            bookId = req.params.bookId;
            db.query(`UPDATE book SET name=?, publisher=?, author=?, stock=?, pubdate=?, pagenum=?, ISBN=?, ebook=?, kdc=?, img=?, price=?, nation=?, description=? WHERE id=?`,
             [post.name, post.publisher, post.author, post.stock, post.pubdate, post.pagenum, post.ISBN, post.ebook, post.kdc, post.img, post.price, post.nation, post.description, bookId],
             function(error, result) {
                if (error) console.error(error);
                res.writeHead(302, {Location: `/`});
                res.end();
             });
        });
    },

    bookDelete_process: function(req, res) {
        var bookId = req.params.bookId;
        db.query(`DELETE FROM book WHERE id=?`, [bookId], function(error, result) {
                if (error) throw error;
                res.writeHead(302, {Location: '/'});
                res.end();
        });
    }
}