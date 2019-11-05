const { SuccessModel, ErrorModel } = require('../model/resModel');
const { 
  getList, 
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');

  // 统一的登录验证, 类似登录验证的中间件
  const loginCheck = (req) => {
    if (!req.session.username) {
      return Promise.resolve(new ErrorModel('登录失败'));
    }
  }

const handleBlogRouter = (req, res) => {
  const method = req.method;

  // 博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    // const listData = getList(author, keyword);
    // return new SuccessModel(listData);

    // 
    if (req.query.isadmin) {
      // 管理员界面
      // 登录验证
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
        return loginCheckResult;
      }
      // 如果是自己, 强行获取自己的列表
      author = req.session.username;
    }


    return getList(author, keyword).then(listData => {
      return new SuccessModel(listData);
    })
  };

  // 博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id;
    return getDetail(id).then(dataList => {
      return new SuccessModel(dataList);
    })
  };

  // 博客新增
  if (method === 'POST' && req.path === '/api/blog/new') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult;
    }

    req.body.createtime = Date.now();
    req.body.author = req.session.username;
    return newBlog(req.body).then(newData => {
      return new SuccessModel(newData);
    })
  };

  // 博客更新
  if (method === 'POST' && req.path === '/api/blog/update') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const id = req.query.id;
    return updateBlog(id, req.body).then(updateData => {
      if (updateData) {
        return new SuccessModel();
      }
      return new ErrorModel('更新失败');
    })
  };

  // 博客删除
  if (method === 'POST' && req.path === '/api/blog/del') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const id = req.query.id;
    req.body.author = req.session.username;
    return delBlog(id, req.body.author).then(data => {
      if (data) {
        return new SuccessModel();
      }
      return new ErrorModel('删除失败');
    })
  };
};

module.exports = handleBlogRouter;