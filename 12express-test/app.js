const express = require('express');

// 本次http的实例
const app = express();
// 第一个参数没有路由, 那所有路由都会执行一次
// 执行完才能next(), 执行下一步
app.use((req, res, next) => {
  console.log('请求开始', req.method, req.url);
  next();
})
// 模拟处理cookie的中间件, next()
app.use((req, res, next) => {
  // 假设处理cookie
  req.cookies = {
    sessionid: 123
  }
  next();
})
// 模拟异步处理post data的中间件, next()
app.use((req, res, next) => {
  // 假设处理post data
  // 异步
  setTimeout(() => {
    req.body = {
      a: 12,
      b: 123
    }
    next();
  })
})
// 匹配到'/api'接口的都执行一遍, next()
app.use('/api', (req, res, next) => {
  console.log(`处理'/api'路由`)
  next();
})
// 匹配到 get '/api'都执行一遍, next()
app.get('/api', (req, res, next) => {
  console.log(`get /api路由`)
  next();
})

app.post('/api', (req, res, next) => {
  console.log(`post /api 路由`)
  next();
})

// 模拟登陆验证
const loginCheck = (req, res, next) => {
  setTimeout(() => {
    // console.log('登陆失败');
    // res.json({
    //   errno: -1,
    //   msg: '登陆失败'
    // })
    next()
    console.log('登陆成功');
  })
}
// 匹配到get '/api/get-cookie'执行, 是否登录, 登录才能next()
// loginCheck 也算中间件
app.get('/api/get-cookie', loginCheck, (req, res, next) => {
  res.json({
    errno: 0,
    data: req.cookies
  })
  // 没有next了
  // next();
})

app.post('/api/get-body', (req, res, next) => {
  res.json({
    errno: 0,
    data: req.body
  })
  // 没有next了
  // next();
})
// 未匹配的的, 设置404
app.use((req, res, next) => {
  console.log('处理404');
  res.json({
    errno: -1,
    msg: '404 not found'
  })
})

app.listen(3000, () => {
  console.log('ok');
})