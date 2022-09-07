var http = require('http');
var fs = require('fs');
var urlm = require('url');

var app = http.createServer( function(req, res) {
    var url = req.url;
    var queryData = urlm.parse(url, true).query;
    console.log(queryData.id);
    var title = queryData.id;

    if (req.url == '/') {
        title = 'Welcome';
    }
    if (req.url == '/favicon.ico') {
        return res.writeHead(404);
    }

    res.writeHead(200);
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
        <li><a href="/?id=13-CSS">HTML</a></li>
        <li><a href="/?id=13-JavaScript">HTML</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${description}</p>
        </body>
        </html>  `;
        res.end(template);
    });
});
app.listen(3000);