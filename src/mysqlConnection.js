// mysqlConnection.js
import mysql from 'mysql';

export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'aven',
  password: '123456',
  database: 'unipass'
});


