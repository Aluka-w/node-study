const { ErrorModel } = require('../model/resModel');

module.exports = async (ctx, next) => {
  // 已登录, 执行下一步
  if (ctx.session.username) {
    await next();
    return
  }
  // 未登录, 直接结束
  ctx.body = new ErrorModel('未登录');
}