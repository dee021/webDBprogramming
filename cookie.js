const express = require('express');
const app = express();

app.get('/', function(req, res)  {
    res.writeHead(200, {
        'Set-Cookie': ['yummy_cookie=choco', 'tasty_cookie=strawberry',
    `Permanent=cookies;Max-Age=${60*60*24*30}`]
    });
    res.end('Cookie!!');
    
});

app.listen(3000, () => console.log('Test'));