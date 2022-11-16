var template = {
    HTML: function(title, list, body, control) {
        return `
        <!doctype html>
        <html><head>
                <title>WEB1 - ${title}</title>
                <meta charset='utf-8'></head>
                <body>
                <h1><a href='/'>1년 연중 일정 및 계획</a></h1>
                ${list}
                ${control}
                <h2>${title}</h2>
                ${body}
                </body>
                </html>
        `;
    },

    List: function (filelist) {
        var list = '<ul>';
                    var i =0;
                    while (i < filelist.length) {
                        list = list + `<li><a href="/?id=${filelist[i].title}">${filelist[i].title} 월</a></li>`;
                        i = i + 1;
                    }
                    list = list + '</ul>';
        return list;
    },

    authorSelect: function(authors, author_id) {
        var tag = '';
        var i = 0;
        while(i < authors.length) {
            var selected = '';
            if(authors[i].id === author_id) {
                selected = ' selected';
            }
            tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
            i++;
        }
        return `
        <select name="author">
        ${tag}
        </select>`;
    }
};

module.exports = template;