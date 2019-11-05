// // redis的测试
// const redis = require('redis');
// // 创建客户端
// const redisClient = redis.createClient(6379, '127.0.0.1');
// // 客户端报错的时候, 跑出错误
// redisClient.on('error', err => {
//   console.err(err);
// })

// // 测试
// redisClient.set('myname', 'zhangsan', redis.print);
// redisClient.get('myname', (err, val) => {
//   if (err) {
//     console.err(err)
//   }
//   console.log('val', val);
//   // 退出
//   redisClient.quit()
// })

const redis = require('redis');
const redisClient = redis.createClient(6379, '127.0.0.1');
redisClient.on('error', err => {
  console.log(err);
})

redisClient.set('mytest', 'lol', redis.print);
redisClient.get('mytest', (err, data) => {
  if (err) {
    console.log(err)
  }
  console.log('val', data);
  redisClient.quit();
})