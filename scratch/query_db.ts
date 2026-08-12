import { getDbConnection } from "../src/lib/db";

async function run() {
  try {
    const pool = await getDbConnection();
    console.log("Connected to DB.");

    // Check Tables
    const tables = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    console.log("Tables:", tables.recordset.map((t: any) => t.TABLE_NAME));

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

    // Get Data from SolutionImages
    try {
      const imgData = await pool.request().query(`SELECT * FROM SolutionImages`);
      console.log("SolutionImages Data:", imgData.recordset);
    } catch(e) {}

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
