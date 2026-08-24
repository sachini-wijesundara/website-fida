import sql from 'mssql';
import fs from 'fs';

const env = fs.readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...vals] = line.split("=");
    if (key && vals.length > 0) {
      let val = vals.join("=").trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      process.env[key.trim()] = val;
    }
  }
}

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: { encrypt: true, trustServerCertificate: true },
};

async function run() {
  const pool = await new sql.ConnectionPool(config).connect();
  const result = await pool.request().query("SELECT title, order_index, slug FROM solutions ORDER BY order_index ASC");
  for (const row of result.recordset) {
      console.log(`[${row.order_index}] ${row.title} -> slug: ${row.slug}`);
  }
  await pool.close();
}
run().catch(console.error);
