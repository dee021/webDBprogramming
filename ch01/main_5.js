// queryData.id가 undefined임을 해결
var http = require('http');
var fs = require('fs');
var urlm = require('url');

var app = http.createServer( function(req, res) {
    var url = req.url;
    var queryData = urlm.parse(url, true).query; 
    /* parse
    true : Object형으로 가져옴 -> 속성명으로 접근 가능해짐
    flase : 문자형으로 가져옴 */

    var title = queryData.id;

    console.log(urlm.parse(url, true));

    var pathname = urlm.parse(url, true).pathname; 
    /* 메소드명().속성이름
       : 왼쪽부터 실행(메소드 먼저 실행)후 반환되는 객체의 속성을 의미
    */

    if(pathname == '/') {
        if(queryData.id === undefined){
        fs.readFile(`${queryData.id}`, 'utf-8', function(err, description) {
            var title = 'Welcome';
            description = 'Hello, Node.js';
            var template = `
            
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset='utf-8'>
            </head>
            <body>
            <h1><a href='/'>WEB</a></h1>
            <ol>
            <li><a href="/?id=13-HTML">HTML</a></li>
            <li><a href="/?id=13-CSS">CSS</a></li>
            <li><a href="/?id=13-JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>  `;
            res.writeHead(200);
            res.end(template);
        });
    } else { // 
        fs.readFile(`${queryData.id}`, 'utf-8', function(err, description) {
            var template = `
            
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset='utf-8'>
            </head>
            <body>
            <h1><a href='/'>WEB</a></h1>
            <ol>
            <li><a href="/?id=13-HTML">HTML</a></li>
            <li><a href="/?id=13-CSS">CSS</a></li>
            <li><a href="/?id=13-JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>  `;
            res.writeHead(200);
            res.end(template);
        });
    }
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});
app.listen(3000);