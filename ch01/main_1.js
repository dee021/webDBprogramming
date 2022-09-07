var http = require('http');
var fs = require('fs');
var urlm = require('url');
var app = http.createServer( function(req, res) {
    var url = req.url;
    var queryData = urlm.parse(url, true).query;
    console.log(queryData);
    console.log(url);
    if (req.url == '/') {
        url = '/test.html';
    }
    if (req.url == '/gachon') {
        url = '/test2.html';
    }
    if (req.url == '/favicon.ico') { // 
        return res.writeHead(404);
    }

    res.writeHead(200);
    console.log(__dirname + url);
    // res.end(fs.readFileSync(__dirname + url));
    
    
 /*    var txt = '';
    if (queryData.id == 'HTML') {
        txt = 'Hyper Text Markup Language';
    }
    if (queryData.id == 'nodejs') {
        txt = 'node!';
    }
    if (queryData.id == 'css') {
        txt = 'Hi';
    } */

    var template = `
    <!DOCTYPE html>
    <head>
    <title>WEB1 - ${queryData.id}  </title>
    <meta charset='utf-8'>
    </head>
    <body>
    <h1><a href="test.html">WEB</a></h1>
    <ol>
<li><a href="05-1.html">HTML</a></li>
<li><a href="05-2.html">CSS</a></li>
<li><a href="05-3.html">JavaScript</a></li>
</ol>
<h2>${queryData.id}</h2>
<p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 
speicification">Hypertext Markup Language (HTML)</a> is the standard markup 
language for <strong>creating <u>web</u> pages</strong> and web 
applications.Web browsers receive HTML documents from a web server or from 
local storage and render them into multimedia web pages. HTML describes the 
structure of a web page semantically and originally included cues for the 
appearance of the document.
</p><p style="margin-top:45px;">HTML elements are the building blocks of 
HTML pages. With HTML constructs, images and other objects, such as 
interactive forms, may be embedded into the rendered page. It provides a 
means to create structured documents by denoting structural semantics for 
text such as headings, paragraphs, lists, links, quotes and other items. HTML 
elements are delineated by tags, written using angle brackets.
</p>
    </body>
    </html>
    `;

    // res.end(txt);
    res.end(template);
});
app.listen(3000); // param) 1 : PORT / 2 : IP addr. default = localhost