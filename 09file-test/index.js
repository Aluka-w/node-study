const fs = require('fs');
const path = require('path');

const fileName = path.resolve(__dirname, 'data.txt');

// 读取文件
// fs.readFile(fileName, (err, data) => {
//   if (err) {
//     console.log(err);
//     return
//   }
//   console.log(data.toString());
// })

// 写文件
// const opt = {
//   flag: 'a' // a是写入, w是覆盖
// }
// fs.writeFile(fileName, '这是文字\n', opt, (err) => {
//   if (err) {
//     console.log(err);
//   }
// })

// 验证文件是否存在
// fs.exists(fileName, (exists) => {
//   console.log(exists)
// })