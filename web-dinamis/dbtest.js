const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', port: 3306, user: 'morinuas', password: 'uas123', database: 'db_uas040' });
    const [rows] = await conn.query('SELECT 1 as ok');
    console.log('DB OK', rows);
    await conn.end();
  } catch (e) {
    console.error('DB ERR', e);
    process.exit(1);
  }
})();
