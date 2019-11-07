var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
    return login(username, password).then(result => {
      if (result && result.username) {
        // 设置session
        req.session.username = result.username;
        req.session.realname = result.realname;
        res.json(new SuccessModel());
        return
      }
      res.json(new ErrorModel('登录失败'));
    })
});

// 模拟直接session存储登录信息
router.get('/login-test', function(req, res, next) {
  if (req.session.username) {
    res.json({
      errno: 0,
      msg: '已登录'
    })
    return
  }
  res.json({
    errno: -1,
    msg: '未登录'
  })
});


module.exports = router;
