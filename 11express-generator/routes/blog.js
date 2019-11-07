var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');
const { 
  getList, 
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');

/* GET users listing. */
router.get('/list', function(req, res, next) {
    //express 自带的req.query解析get参数
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    if (req.query.isadmin) {
      // 管理员界面
      // 登录验证
      if (req.session.username == null) {
        res.json( new ErrorModel('未登录'));
        return
      }
      // 如果是自己, 强行获取自己的列表
      author = req.session.username;
    }


    // res.json, 干了两件事 
    // 设置返回头res.setHeader('Content-type', 'application/json')
    // 设置json格式, res.end(JSON.stringify())
    return getList(author, keyword).then(listData => {
      res.json(new SuccessModel(listData));
    })
});
router.get('/detail', function(req, res, next) {
  const id = req.query.id;
    return getDetail(id).then(dataList => {
      res.json(new SuccessModel(dataList));
    })
});
router.post('/new', loginCheck, function(req, res, next) {
  req.body.createtime = Date.now();
  req.body.author = req.session.username;
  return newBlog(req.body).then(newData => {
    res.json(new SuccessModel(newData));
  })
});
router.post('/update', loginCheck, function(req, res, next) {
  const id = req.query.id;
  return updateBlog(id, req.body).then(updateData => {
    if (updateData) {
      res.json(new SuccessModel());
    }
    res.json(new ErrorModel('更新失败'));
  })
});
router.post('/del', loginCheck, function(req, res, next) {
  const id = req.query.id;
  req.body.author = req.session.username;
  return delBlog(id, req.body.author).then(data => {
    if (data) {
      res.json(new SuccessModel());
    }
    res.json(new ErrorModel('删除失败'));
  })
});

module.exports = router;
