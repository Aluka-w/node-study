const xss = require('xss');
const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and keyword like'%${keyword}%' `
  }
  sql += 'order by createtime desc';
  return exec(sql);
}

const getDetail = (id) => {
  let sql = `select * from blogs where id='${id}'`;
  return exec(sql).then(dataList => {
    return dataList[0]
  })
}

const newBlog = (newBlog = {}) => {
  // return {
  //   id: 3
  // }
  let { title, content, createtime, author } = newBlog;
  title = xss(title);
  content = xss(content);
  let sql = `insert into blogs(title, content, createtime, author) values('${title}', '${content}', ${createtime}, '${author}');`;
  return exec(sql).then(newData => {
    return {
      id: newData.insertId
    }
  })
}

const updateBlog = (id, updateBlog = {}) => {
  // return false
  const { title, content } = updateBlog;
  let mysql = `update blogs set title='${title}', content='${content}' where id='${id}'`;
  return exec(mysql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false
  })
}

const delBlog = (id, author) => {
  // return true
  let mysql = `delete from blogs where id='${id}' and author='${author}'`;
  return exec(mysql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}