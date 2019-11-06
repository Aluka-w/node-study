var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
  // res.json, 干了两件事 
  // 设置返回头res.setHeader('Content-type', 'application/json')
  // 设置json格式, res.end(JSON.stringify())
  res.json({
    errno: 0,
    data: [1, 2, 3]
  })
});

module.exports = router;
