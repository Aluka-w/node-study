const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建redis对象
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
  console.log(err);
})

// 设置值是对象时, 转成字符串
const setRedis = (key, val) => {
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }
  redisClient.set(key, val, redis.print);
}
// 当为null, 返回null, 有可能是对象时, 转为对象再传
const getRedis = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
      if (err) {
        reject(err);
        return
      }
      if (data === null) {
        resolve(null)
      }
      try {
        resolve(JSON.parse(data));
      } catch (ex) {
        resolve(data);
      }
    })
  })
}

module.exports = {
  setRedis,
  getRedis
}