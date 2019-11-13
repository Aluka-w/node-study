const xss = require('xss');
const { exec } = require('../db/mysql');

const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and keyword like'%${keyword}%' `
  }
  sql += 'order by createtime desc';
  return await exec(sql);
}

const getDetail = async (id) => {
  let sql = `select * from blogs where id='${id}'`;
  const rows = await exec(sql);
  return rows[0];
}

const newBlog = async (newBlog = {}) => {
  // return {
  //   id: 3
  // }
  let { title, content, createtime, author } = newBlog;
  title = xss(title);
  content = xss(content);
  let sql = `insert into blogs(title, content, createtime, author) values('${title}', '${content}', ${createtime}, '${author}');`;
  const newData = await exec(sql);
  return {
    id: newData.insertId
  }
}

const updateBlog = async (id, updateBlog = {}) => {
  // return false
  const { title, content } = updateBlog;
  let mysql = `update blogs set title='${title}', content='${content}' where id='${id}'`;
  const updateData = await exec(mysql);
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false
}

const delBlog = async (id, author) => {
  // return true
  let mysql = `delete from blogs where id='${id}' and author='${author}'`;
  const updateData = await exec(mysql);
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false;
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}