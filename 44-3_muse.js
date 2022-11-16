var part = require('./44-2_mpart.js');
console.log(part); // require롤 받아온 객체 출력
part.f(); // require로 받아온 객체 M의 멤버 함수 f() 실행

/* 출력 결과
{ v: 'v', f: [Function: f] }
v
*/