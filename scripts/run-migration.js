const fs = require('fs');
const path = require('path');
const pool = require('../server/db');

async function run() {
  const file = path.join(__dirname, 'migrations', '001_create_location_logs.sql');
  const sql = fs.readFileSync(file, 'utf8');

  try {
    await pool.query(sql);
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
