//koa的中间件运行机制(洋葱圈模型)
const Koa = require('koa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  console.log('第一次洋葱, 开始');
  await next(); // 遇到await, 则等待下一个中间件完成返回promise, 再往下执行
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('第一次洋葱, 结束');
});

// x-response-time
app.use(async (ctx, next) => {
  console.log('第二次洋葱, 开始');
  const start = Date.now();
  await next(); // 遇到await, 则等待下一个中间件完成再执行下面
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('第二次洋葱, 结束');
});

// response
app.use(async ctx => {
  console.log('第三次洋葱, 开始');
  ctx.body = 'Hello World';
  console.log('第三次洋葱, 结束');
});

app.listen(3000);
// 打印的过程, 形成洋葱圈模型
// 第一次洋葱, 开始
// 第二次洋葱, 开始
// 第三次洋葱, 开始
// 第三次洋葱, 结束
// 第二次洋葱, 结束
// GET / - 9ms
// 第一次洋葱, 结束