const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'ibu-notice-system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on load
db.getConnection().then(connection => {
  console.log('✅ MySQL connected: ibu-notice-system (XAMPP)');
  connection.release();
}).catch(err => {
  console.error('❌ MySQL connection FAILED:', err.message);
  console.error('Check: XAMPP MySQL running? DB ibu-notice-system exists?');
});

module.exports = db;

