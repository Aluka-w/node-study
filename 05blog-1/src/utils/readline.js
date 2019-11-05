const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log');
// 文件IO, 读取文件流
const readStream = fs.createReadStream(fileName);
// 创建readline, 逐行读取文件
const rl = readline.createInterface({
  input: readStream
})

let chromeNum = 0;
let sum = 0;
// 逐行的过程
rl.on('line', (lineData) => {
  if (!lineData) {
    return
  }
  sum++;
  const arr = lineData.split(' -- ');
  if (arr[2] && arr[2].indexOf('Chrome') > 0) {
    chromeNum++;
  }
})
// 全部读取完毕
rl.on('close', () => {
  console.log('chrome浏览器的占比', chromeNum / sum)
})



