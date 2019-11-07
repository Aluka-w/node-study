const { ErrorModel } = require('../model/resModel');

module.exports = (req, res, next) => {
  // 已登录, 执行下一步
  if (req.session.username) {
    next();
    return
  }
  // 未登录, 直接结束
  res.json( new ErrorModel('未登录') );
}