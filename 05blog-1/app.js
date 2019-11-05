const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { getRedis, setRedis } = require('./src/db/redis');
const { access } = require('./src/utils/log');

// 处理post data
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return
    }
    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    })
    req.on('end',  () => {
      if (!postData) {
        resolve({});
        return
      }
      resolve(JSON.parse(postData));
    })
  })
}
// 设置登录过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

// session 数据
// const SESSION_DATA = {};

const serverHandle = (req, res) => {
  // 记录日志
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)


  // 设置返回头
  res.setHeader('Content-type', 'application/json');

  // 处理url
  const url = req.url;
  req.path = url.split('?')[0];
  // 处理query
  req.query = querystring.parse(url.split('?')[1]);

  // 处理cookie
  req.cookie = {};
  let cookirStr = req.headers.cookie || '';
  cookirStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=');
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  // 未引入redis
  // // 解析session
  // let needSetCookie = false;
  // let userid = req.cookie.userid;
  // if (userid) {
  //   if (!SESSION_DATA[userid]) {
  //     SESSION_DATA[userid] = {};
  //   }
  // } else {
  //   needSetCookie = true;
  //   userid = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userid] = {};
  // }
  // req.session = SESSION_DATA[userid];

  // 引入redis
  let needSetCookie = false;
  let userid = req.cookie.userid;
  if (!userid) {
    needSetCookie = true;
    userid = `${Date.now()}_${Math.random()}`;
    // 初始化redis中的session的值
    setRedis(userid, {});
  } 
  // 获取session的值
  req.sessionid = userid;
  getRedis(req.sessionid).then(sessionData => {
    if (sessionData == null) {
      setRedis(req.sessionid, {});
      // 设置session
      req.session = {};
    } else {
      req.session = sessionData;
    }
    // 处理postdata
    return getPostData(req);
  }).then(postData => {
    req.body = postData;
    // blog路由的处理
    // const blogData = handleBlogRouter(req, res);
    // if (blogData) {
    //   res.end(JSON.stringify(blogData));
    //   return
    // };
    const blogData = handleBlogRouter(req, res);
    if (blogData) {
      blogData.then(data => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`);
        }
        res.end(JSON.stringify(data));
      })
      return
    };
  
    // user路由的处理
    const userData = handleUserRouter(req, res);
    if (userData) {
      userData.then(data => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`);
        }
        res.end(JSON.stringify(data));
      })
      return
    };
  
    //未匹配到路由的处理
    res.writeHeader(404, {'content-type': 'text/plain'});
    res.write('404 NOT FOUND!\n');
    res.end();
  })
};

module.exports = serverHandle;