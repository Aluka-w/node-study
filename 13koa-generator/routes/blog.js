const router = require('koa-router')()
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');
const { 
  getList, 
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || '';
  const keyword = ctx.query.keyword || '';
  if (ctx.query.isadmin) {
    // 管理员界面, 登录验证
    if (ctx.session.username == null) {
      ctx.body = new ErrorModel('未登录');
      return
    }
    author = ctx.session.username;
  }
  const listData = await getList(author, keyword);
  ctx.body = new SuccessModel(listData);
})

router.get('/detail', async function(ctx, next) {
  const id = ctx.query.id;
  const dataList = await getDetail(id);
  ctx.body = new SuccessModel(dataList);
});

router.post('/new', loginCheck, async function(ctx, next) {
  ctx.request.body.createtime = Date.now();
  ctx.request.body.author = ctx.session.username;
  const newData = await newBlog(ctx.request.body);
  ctx.body = new SuccessModel(newData);
});

router.post('/update', loginCheck, async function(ctx, next) {
  const id = ctx.query.id;
  const updateData = await updateBlog(id, ctx.request.body);
  if (updateData) {
    ctx.body = new SuccessModel();
    return
  }
  ctx.body = new ErrorModel('更新失败');
});

router.post('/del', loginCheck, async function(ctx, next) {
  const id = ctx.query.id;
  ctx.request.body.author = ctx.session.username;
  const data = await delBlog(id, ctx.request.body.author);
  if (data) {
    ctx.body = new SuccessModel();
    return
  }
  ctx.body = new ErrorModel('删除失败');
});
module.exports = router
