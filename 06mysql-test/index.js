const mysql = require('mysql');

const con = mysql.createConnection({
  port: '3306',
  host: 'localhost',
  password: '722.616.623wang',
  database: 'myblog2',
  user: 'root'
})

const sql = 'select * from users';
con.query(sql, (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(result);
})

con.end();