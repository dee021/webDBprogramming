// 폴더의 파일 목록 읽기
var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist) {
    console.log(filelist);
});