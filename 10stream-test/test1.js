// 标准输入输出 (Linux概念, node的实现)
// shell 输入什么, 用管子连接, 就会输出什么
// process.stdin.pipe(process.stdout);

// postman输入什么, 就会响应什么, node中的stream的例子
// const http = require('http');
// const server = http.createServer((req, res) => {
//   if (req.method === 'POST') {
//     req.pipe(res)
//   }
// })
// server.listen(3000, console.log('ok'));


// stream复制文件, 边读取, 边写入
// const fs = require('fs');
// const path = require('path');

// const fileName1 = path.resolve(__dirname, 'data.txt');
// const fileName2 = path.resolve(__dirname, 'data-bak.txt');

// const readStream = fs.createReadStream(fileName1);
// const writeStream = fs.createWriteStream(fileName2);

// readStream.pipe(writeStream);
// readStream.on('end', () => {
//   console.log('copy ok');
// })


// stream 直接把读取文件返回
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const fileName = path.resolve(__dirname, 'data.txt');
  if (req.method === 'GET') {
    // 文件IO操作stream
    const readStream = fs.createReadStream(fileName);
    // 网络IO操作stream
    readStream.pipe(res);
  }
})

server.listen(3000);
