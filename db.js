const mysql = require('mysql');

// db연결 설정 
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME, 
//   port: process.env.DB_PORT || 3306,
// });

// // 연결 
// connection.connect((err) => {
//   if (err) {
//     console.error('MYSQL 연결 실패 :', err);
//     return;
//   }
//   console.log('MYSQL 연결 성공');
// });

// module.exports = connection;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("MYSQL 연결 실패:", err);
    return;
  }

  console.log("MYSQL 연결 성공");
  connection.release();
});

module.exports = db;
