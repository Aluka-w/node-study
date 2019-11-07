var createError = require('http-errors'); // 对于404的友好提示
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser'); // 解析cookie
var logger = require('morgan'); // 配置完, 就记录access.log, 
const session = require('express-session'); // 获取session
const redisStore = require('connect-redis')(session); // 连接redis
// 引入路由处理
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

// http的实例
var app = express();

// 前端页面的设置, public和views文件夹就可以删除了
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// use是注册, 引用哪个中间件就use

// 在开发环境下使用access.log
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  // 开发环境下, 打印在控制台
  app.use(logger('dev'));
} else {
  // 上线环境下, 答应在log日志上
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, { flags: 'a' });
  // 此配置是morgan自带的, 具体可查github, 线上环境, 记录日志更清晰
  app.use(logger('combined', {
    stream: writeStream
  }));

}


app.use(express.json());  // 获取post data赋值在req.body, 前端提交'application/json'
app.use(express.urlencoded({ extended: false })); // 获取post data赋值在req.body, 提交符合urlencoded(表单提交)的情况下
app.use(cookieParser()); // 使得req.cookies 拿到cookie
// app.use(express.static(path.join(__dirname, 'public'))); // 静态文件, 前端代码
const redisClient = require('./db/redis');
const sessionStore = new redisStore({
  client: redisClient
})
// 设置session, 在路由之前
app.use(session({
  secret: '122ydisa',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// app.use('/', indexRouter); // 根路由
// app.use('/users', usersRouter); // 父路由 -> 具体到每一层还有子路由, 一般是'/', 合起来: '/users/'
app.use('/api/blog', blogRouter); // 合起来就是 '/api/blog/list'
app.use('/api/user', userRouter);

// 404的处理
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理
app.use(function(err, req, res, next) {
  // 当环境为开啊环境的时候, 抛出问题
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
