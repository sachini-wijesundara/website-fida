require("@next/env").loadEnvConfig(process.cwd());
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 1433),
  options: { encrypt: true, trustServerCertificate: true },
};

async function fixSlug() {
  try {
    const pool = await sql.connect(config);
    await pool.request().query("UPDATE Solutions SET slug = 'smart-hris' WHERE id = 14");
    console.log("Updated slug successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixSlug();
