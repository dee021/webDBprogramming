// db 연결 템플릿으로 변경
var template = {
    HTML:function(title, list, body, control) {
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
        </body>
        </html>`;
    },
    list:function(filelist) {
        var list = '<ul>';
        var i = 0 ;
        while(i<filelist.length) {
            list = list + `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
            // sql에서 PK로 질의 -> id = 키값으로 querystring을 만들어 줘야 함
           i = i + 1;
        }
        list = list + '</ul>';
        return list;
    }
};

module.exports = template;

// 또는 var template = { 내용 } 대신 module.exports = { 내용 } 도 가능