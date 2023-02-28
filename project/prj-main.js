var session = require('express-session');
var db = require('./lib/db.js');
var etc = require('./etc.js');
var book = require('./book');
var auth = require('./authentication');
var card = require('./namecard');
var user = require('./user');
var board = require('./board');
var express = require('express');
var app = express();


var MySqlStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2022'
};
var sessionStore = new MySqlStore(options);

app.use(session({
    secret: 'fdagesg!@!dfsegddddsge', // 암호화 키
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// auth
app.get('/login', function(req, res) {
    auth.login(req,res);
});
app.post('/login_process', function(req, res) {
    auth.login_process(req, res);
});
app.get('/logout', function(req, res) {
    auth.logout(req, res);
});

app.get('/register', function(req, res) {
    auth.register(req, res);
});
app.post('/register_process', function(req, res) {
    auth.register_process(req, res);
});

app.get('/pwchange', function(req, res){
    auth.pwchange(req, res);
});
app.post('/pwchange_process', function(req, res) {
    auth.pwchange_process(req, res);
});

app.get('/cart', function(req, res) {
    book.cart(req, res);
});

app.post('/cart/create_process', function(req, res) { 
    book.cartCreate_process(req, res);
});

app.post('/cart/delete_process', function(req, res) {
    book.cartDelete_process(req, res);
});

app.get('/purchase', function(req, res) {
    book.purchase(req, res);
});

app.post('/purchase_process', function(req, res) {
    book.purchase_process(req, res);
});

app.post('/purchase/cancel', function(req, res) {
    book.purchase_cancel(req, res);
});

app.post('/purchase/refund', function(req, res) {
    book.purchase_refund(req, res);
});

// board
app.get('/board/list/:pNum', function(req, res) {
    board.list(req, res);
});

app.get('/board/view/:bNum/:pNum', function(req, res) {
    board.view(req, res);
});

app.get('/board/create', function(req, res) {
    board.create(req, res);
});

app.post('/board/create_process', function(req, res) {
    board.create_process(req, res);
});

app.get('/board/update/:bNum/:pNum', function(req, res) {
    board.update(req, res);
});

app.post('/board/update_process', function(req, res) {
    board.update_process(req, res);
});

app.get('/board/delete/:bNum/:pNum', function(req, res) {
    board.delete(req, res);
});

// book

app.get('/book/create', function(req, res) {
    book.bookCreate(req, res);
});
app.post('/book/create_process', function(req, res) {
    book.bookCreate_process(req, res);
});
app.get('/book/list', function(req, res) {
    book.bookList(req, res);
});
app.get('/book/search', function(req, res) {
    book.search(req, res);
});

app.post('/book/search', function(req, res) {
    book.search(req, res);
});

app.get('/', function(req, res, next) {
    req.url = '/book/1';
    next();
});

app.get('/book/:pNum', function(req, res) {
    book.home(req, res);
});
app.get('/detail/:bookId', function(req, res) {
    book.detail(req, res);
});
app.get('/best', function(req, res) {
    book.best(req, res);
})
app.get('/monbook', function(req, res) {
    book.monbook(req, res);
});
app.get('/ebook/:pNum', function(req, res) {
    book.ebook(req, res);
});

app.get('/book/update/:bookId', function(req, res) {
    book.bookUpdate(req, res);
});
app.post('/book/update_process/:bookId', function(req, res) {
    book.bookUpdate_process(req, res);
});
app.get('/book/delete_process/:bookId', function(req, res) {
    book.bookDelete_process(req, res);
});

// calendar
app.get('/calendar', function(req, res) {
    etc.calendarHome(req, res);
});
app.get('/calendar/create', function(req, res) {
    etc.calendarCreate(req, res);
});
app.post('/calendar/create_process', function(req, res) {
    etc.calendarCreate_process(req, res);
});
app.get('/calendar/list', function(req, res) {
    etc.calendarList(req, res);
});
app.get('/calendar/update/:planId', function(req, res) {
    etc.calendarUpdate(req, res);
});
app.post('/calendar/update_process/:planId', function(req, res) {
    etc.calendarUpdate_process(req, res);
});
app.get('/calendar/delete_process/:planId', function(req, res) {
    etc.calendarDelete_process(req, res);
});

app.get('/calendar/search', function(req, res) {
    etc.search(req, res);
});

app.post('/calendar/search', function(req, res) {
    etc.search(req, res);
});

// namecard
app.get('/namecard', function(req, res) {
    card.namecardHome(req, res);
});
app.get('/namecard/create', function(request, response) {
    card.namecardCreate(request, response);
});
app.post('/namecard/create_process', function(req, res) {
    card.namecardCreate_process(req, res);
});
app.get('/namecard/list', function(req, res) {
    card.namecardList(req, res);
});
app.get('/namecard/update/:cardId', function(req, res) {
    card.namecardUpdate(req, res);
});
app.post('/namecard/update_process/:cardId', function(req, res) {
    card.namecardUpdate_process(req, res);
});
app.get('/namecard/delete_process/:cardId', function(req, res) {
    card.namecardDelete_process(req, res);
});

app.get('/namecard/search', function(req, res) {
    card.search(req, res);
});

app.post('/namecard/search', function(req, res) {
    card.search(req, res);
});

// user
app.get('/user', function(req, res) {
    user.userHome(req, res);
});
app.get('/user/create', function(req, res) {
    user.userCreate(req, res);
});
app.post('/user/create_process', function(req, res) {
    user.userCreate_process(req, res);
});
app.get('/user/list', function(req, res) {
    user.userList(req, res);
});
app.get('/user/update/:userId', function(req, res) {
    user.userUpdate(req, res);
});
app.post('/user/update_process/:userId', function(req, res) {
    user.userUpdate_process(req, res);
});
app.get('/user/delete_process/:userId', function(req, res) {
    user.userDelete_process(req, res);
});

app.listen(3000, () => console.log('example app listening on port 3000'));
