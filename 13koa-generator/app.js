const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')      // 处理错误
const bodyparser = require('koa-bodyparser')// 处理post dat 
const logger = require('koa-logger')        // 处理请求的打印, 并没有实现日志
const session = require('koa-generic-session')  // 处理session
const redisStroe = require('koa-redis') // redis
const { REDIS_CONF } = require('./conf/db')
const fs = require('fs')
const path = require('path')
const morgan = require('koa-morgan')        // 记录日志, 确保正确

const index = require('./routes/index')     // 路由
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

// error handler
onerror(app)

// middlewares
// 处理post data, 包括json, form表单, text
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
// 把post data的格式变成json
app.use(json())
// 打印日志
app.use(logger())
// 处理静态文件
app.use(require('koa-static')(__dirname + '/public'))
// 处理前端页面
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 日志, 看某件事的耗时
app.use(async (ctx, next) => {
  const start = new Date()
  await next() // 执行某件事件
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 处理session在路由之前
app.keys = ['31321']  // 秘匙
app.use(session({
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStroe({
    // all: "127.0.0.1:6379"   // redis的地址和端口
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// 配置日志
const env = process.env.NODE_ENV;
if (env === 'dev') {
  // 开发环境只是打印日志
  app.use(morgan('dev'))
} else {
  // 正式环境的时候写入日志
  const fullFile = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(fullFile, {flags: 'a'});
  app.use(morgan("combined", {
    stream: writeStream
  }))
}

// 路由
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// 错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
