// readdir.js 를 적용
var http = require('http');
var fs = require('fs');
var urlm = require('url');
var testFolder = './data';



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
            fs.readdir(testFolder, function(error, filelist) { // readFile을 readdir로 변경
                var title = 'Welcome';
                var description = 'Hello, Node.js';

                // 폴더 안의 파일만큼 listItem 생성
                var list = '<ul>';
                var i = 0;
                while(i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i +1;
                }
                list = list + '</ul>';
            // template의 <li> 내용 변경
                var template = `
            
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset='utf-8'>
            </head>
            <body>
            <h1><a href='/'>WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>  `;
            res.writeHead(200);
            res.end(template);
            });
 
        } else { // queryData.id !== undefined
            fs.readdir(testFolder, function(error, filelist) {
                var list = '<ul>';
                var i = 0;
                while(i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i +1;
                }
                list = list + '</ul>';

            fs.readFile(`${queryData.id}`, 'utf-8', function(err, description) {
                var title = queryData.id;
                var template = `
            
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset='utf-8'>
            </head>
            <body>
            <h1><a href='/'>WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>  `;
            res.writeHead(200);
            res.end(template);
            });
        });
    }} else { // pathname != '/'
    res.writeHead(404);
    res.end('Not found');}
});
app.listen(3000);