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
                        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]} 월</a></li>`;
                        i = i + 1;
                    }
                    list = list + '</ul>';
        return list;
    }  
};

module.exports = template;