const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');
const { setRedis } = require('../db/redis');

const handleUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body;
    // const { username, password } = req.query;
    return login(username, password).then(result => {
      if (result && result.username) {
        // 设置session
        req.session.username = result.username;
        req.session.realname = result.realname;
        // 设置redis中的数据
        setRedis(req.sessionid, req.session)
        return new SuccessModel();
      }
      return new ErrorModel('登录失败');
    })
  };

  // 通过上一步GET登录, 获取到数据的usernam, 然后设置cookie到根路由, 下面自然而然就会
  // 成功登录, 而不需要再浏览器设置cookie 
  // 登录测试, 前端设置cookie.username, 后端能拿到就算登录成功
  // if (method === 'GET' && req.path === '/api/user/login-test') {
  //   // console.log(123, req.cookie)
  //   if (req.session.username) {
  //     return Promise.resolve(new SuccessModel({
  //       session: req.session
  //     }));
  //   }
  //   return Promise.resolve(new ErrorModel('登录失败'));
  // }
};

module.exports = handleUserRouter;