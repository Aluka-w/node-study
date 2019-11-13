const { exec, escape } = require('../db/mysql');
const { getPassword } = require('../utils/cryp');

const login = async (username, password) => {
  username = escape(username);
  password = getPassword(getPassword);
  password = escape(password);
  // console.log('password is', password);
  // 使用了escape函数之后, 原本的''需要去掉, escape函数自动帮加上
  // let sql = `select * from users where username='${username}' and password='${password}'`;
  let sql = `select * from users where username=${username} and password=${password}`;
  const data = await exec(sql);
  return data[0] || {};
}

module.exports = {
  login
}