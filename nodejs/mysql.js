var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'nodejs',
    password: 'nodejs',
    database: 'webdb2022'
});

connection.connect();

connection.query('SELECT * from calendar', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log('calendar table');
    console.log(results);
});

connection.end();

/* 실행 결과
[               // 리스트형
  RowDataPacket { id: 1, name: 'egoing', profile: 'developer' }, // <- 쉼표로 구분
  RowDataPacket { // <- 각 레코드는 'result[idx_value]`로 접근할 수 있음
    id: 2,
    name: 'duru',
    profile: 'database administrator'
  },
  RowDataPacket { // <- 각각은 객체 타입이며, 객체의 멤버 변수를 읽기 위해 `객체이름.멤버변수명`으로 접근
    id: 3,
    name: 'taeho',
    profile: 'data scientist, developer'
  }
]
*/