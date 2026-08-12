import 'dotenv/config';
import sql from 'mssql';

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

    // Check Tables
    const tables = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    console.log("Tables:", tables.recordset.map(t => t.TABLE_NAME));

    // Check Solutions table structure
    const cols = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Solutions'
    `);
    console.log("Solutions Columns:", cols.recordset);

    // Get Data from Solutions
    const data = await pool.request().query(`SELECT * FROM Solutions`);
    console.log("Solutions Data:", data.recordset);

    pool.close();
  } catch (err) {
    console.error(err);
  }
}
run();
