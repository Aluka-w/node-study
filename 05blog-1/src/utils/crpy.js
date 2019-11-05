// 对密码进行md5加密
// node自带的
const crpyto = require('crypto');

//密钥, 随便的文字
const SECRET_KEY = 'Wangbin_666';

//md5加密
const md5 = (content) => {
  let md5 = crpyto.createHash('md5');
  // 生成十六进制
  return md5.update(content).digest('hex');
}

// 加密函数
const getPassword = (password) => {
  const str = `password=${password}&key=${SECRET_KEY}`
  return md5(str);
}
module.exports = {
  getPassword
}
