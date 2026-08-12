const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
});
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: { encrypt: true, trustServerCertificate: true }
};

async function run() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to DB.");

    const tables = await pool.request().query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`);
    console.log("Tables:", tables.recordset.map(t => t.TABLE_NAME));

    const sps = await pool.request().query(`SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE'`);
    console.log("SPs:", sps.recordset.map(t => t.ROUTINE_NAME));

    // Get Solutions table structure
    try {
      const cols = await pool.request().query(`SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Solutions'`);
      console.log("Solutions Columns:", cols.recordset);
    } catch(e) {}

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
