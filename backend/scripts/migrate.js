const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const file = path.resolve(__dirname, '../../database/migrations/001_init.sql');
  const sql = fs.readFileSync(file, 'utf8');
  await pool.query(sql);
  await pool.end();
  console.log('Migration completed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});