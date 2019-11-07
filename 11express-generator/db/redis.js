const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建redis对象
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
  console.log(err);
})

module.exports = redisClient;