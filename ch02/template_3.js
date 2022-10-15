// template 에 author 추가
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
    },
    authorSelect:function(authors, author_id) {
        var tag = '';
        var i = 0;
        while(i < authors.length ) {
            var selected = '';
            if(authors[i].id === author_id) {
                selected = ' selected'
            }
            tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
        }
        return `
        <select name="author">
        ${tag}
        </select>`;
    },
    
    
};

module.exports = template;

// 또는 var template = { 내용 } 대신 module.exports = { 내용 } 도 가능