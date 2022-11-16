// 2주차 : ppt p.45 완성 후 사진 4장 카카오워크

const http = require('http');
const fs = require('fs');
const urlm = require('url');

var app = http.createServer((req, res) => {
    var url = req.url;
    var queryData = urlm.parse(url, true).query;

    var pathname = urlm.parse(url, true).pathname;

    if (pathname == '/'){
        fs.readFile(`${queryData.id}`, 'utf-8', function(err, description) {
            var title;
            
            if (queryData.id === undefined){
                title = 'favicon.ico';
                description = 'A favicon (short for favorite icon), also known as a shortcut icon, website icon, tab icon, URL icon.';
            } else {
                title = queryData.id;
            }

            var template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">favicon이란</a></h1>
            <ol>
            <li><a href="/?id=HIS">1. History</a></li>
            <li><a href="/?id=STAN">2. Standardization</a></li>
            <li><a href="/?id=LEG">3. Legacy</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>` ;
            res.writeHead(200);
            res.end(template);
        });
    } else { // pathname != '/'
        res.writeHead(404);
        res.end('Not found');
    }
});

app.listen(3000);