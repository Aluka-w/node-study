const http = require('http');

const server = http.createServer((req, res) => {
  // pm2会记录日志
  console.log('模拟日志', new Date().toLocaleString());
  console.error('模拟错误'), new Date().toLocaleString();

  if (req.url === '/err') {
    throw new Error('/err 错误, 模拟pm2重启');
  }

  res.setHeader('Content-type', 'application/json');
  res.end(
    JSON.stringify({
      errno: 0,
      data: ['上年度阿森纳11']
    })
  )
})

server.listen(8000, () => {
  console.log('ok');
})