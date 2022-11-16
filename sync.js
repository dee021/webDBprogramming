const { fstat } = require("fs");

// 동기와 비동기
/* ar fs = require('fs');

console.log('A');
var result = fs.readFileSync('28-1_sample.txt', 'utf8');
console.log(result);
console.log('C'); */

/* 출력
A
B
C
*/

console.log('A');
fstat.readFile('28-1_sample.txt', 'utf-8', function(err, result){
    console.log(result);
});
console.log('C');