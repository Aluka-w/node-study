const http = require('http');
const slice = Array.prototype.slice

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [],    // 存放用use函数注册的中间件
      get: [],    // 用get函数注册的中间件
      post: [],   // 用post函数注册的中间件
      put: [],    // 等等http方法
    }
  }
  // 通用注册中间件的方法
  register (path) {
    const info = {};
    if (typeof path === 'string') {
      // 存储当前的地址
      info.path = path;
      // 当前注册的所有中间件, 除了请求地址, 从第二个参数开始, 转为数组
      info.stack = slice.call(arguments, 1)
    } else {
      info.path = '/';
      // 当前注册的所有中间件, 除了请求地址, 从第一个参数开始, 转为数组
      info.stack = slice.call(arguments, 0)
    }
    return info
  }

  use () {
    // 将当前函数形参全部传入, 返回info, path 和注册的所有中间件
    const info = this.register.apply(this, arguments);
    this.routes.all.push(info);
  }

  get () {
    // 将当前函数形参全部传入, 返回info, path 和注册的所有中间件
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }

  post () {
    // 将当前函数形参全部传入, 返回info, path 和注册的所有中间件
    const info = this.register.apply(this, arguments);
    this.routes.all.post(info);
  }
  match (method, url) {
    let stack = [];
    if (url === '/favicon.ico') {
      return stack;
    }

    // 获取routes
    let curRoutes = [];
    // 通过use注册的中间件, 都需要调用
    curRoutes = curRoutes.concat(this.routes.all)
    // 通过get/post的, 直接用method区分, 筛选请求方式
    curRoutes = curRoutes.concat(this.routes[method])

    curRoutes.forEach(routeInfo => {
      // 筛选url
      // url === '/api/list'
      if (url.indexOf(routeInfo.path) === 0) {
        // routeInfo.path === '/' || '/api' || '/api/lis',都符合, 都需要加进去执行
        stack = stack.concat(routeInfo.stack);
      }
    })
    return stack
  }
  // 核心next机制
  handle (req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift();
      if (middleware) {
        // 执行中间件函数, 递归
        middleware(req, res, next);
      }
    };
    next();
  }

  callBack () {
    return (req, res) => {
      // 先定义 res.json的方法
      res.json = (data) => {
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(data));
      }

      const url = req.url;
      const method = req.method.toLowerCase(); // 把method变成小写
      // 通过method和url, 筛选出符合本次请求的, 所有中间件, 然后都需要执行
      // 已经匹配好的中间件列表
      const resultList = this.match(method, url);
      this.handle(req, res, resultList);
    }
  }

  listen (...args) {
    // 直接就创建server服务
    const server = http.createServer(this.callBack());
    // 把port什么的直接结构到了服务对象的listen中
    server.listen(...args);
  }
}
// 工厂函数
module.exports = () => {
  return new LikeExpress()
}