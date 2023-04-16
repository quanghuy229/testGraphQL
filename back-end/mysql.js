const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "neli",
  port: 52000,
  multipleStatements: true,
});

const CREATE_TABLE_TODO = `
CREATE TABLE IF NOT EXISTS todo (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  description varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  isFinished tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

let dbInit = false;

const getDB = async () => {
  return new Promise((resolve, reject) => {
    pool.query(CREATE_TABLE_TODO, (error) => {
      if (error) {
        console.log('error', error)
        return reject(error);
      } else {
        console.log("MySQL is connected and setup");
        dbInit = true;
        return resolve(pool);
      }
    });
  });
};

module.exports = {
  getDB,
};
