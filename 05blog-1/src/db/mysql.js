const { MYSQL_CONF } = require('../conf/db');
const mysql = require('mysql');

// 创建mysql对象
const con = mysql.createConnection(MYSQL_CONF);

// 连接mysql
con.connect();

// 执行mysql语句
const exec = (sql) => {
  return new Promise((reslove, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return
      }
      reslove(result);
    })
  })
}


// 关闭mysql连接, 单例模式, 只保存一个变量
// con.end()

module.exports = {
  exec,
  escape: mysql.escape
}