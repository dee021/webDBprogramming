var template = {
    HTML: function(title, list, body, control) {
        return `
        <!doctype html>
        <html><head>
                <title>WEB1 - ${title}</title>
                <meta charset='utf-8'></head>
                <body>
                <h1><a href='/'>1년 연중 일정 및 계획</a></h1>
                <a href="/author">author</a>
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
                        list = list + `<li><a href="/page/${filelist[i].title}">${filelist[i].title} 월</a></li>`;
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
    },

    authorTable: function(authors) {
        var tag = '<table>';
        var i = 0 ;
        while(i< authors.length) {
            tag = tag + `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td>
            <td><a href="/author/update/${authors[i].id}">update</a></td>
            <td><form action="/author/delete_process" method="post">
            <input type="hidden" name="id" value="${authors[i].id}">
            <input type="submit" value="delete"></form></td></tr>`;
            i = i + 1;
        }
        tag = tag + '</table>';
        return tag;
    }
};

module.exports = template;