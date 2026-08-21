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
  const result = await pool.request().query("SELECT id, slug, template_data FROM solutions");
  
  for (const row of result.recordset) {
    if (row.template_data) {
      try {
        const data = JSON.parse(row.template_data);
        console.log(`${row.slug}: hero.image = ${data.hero?.image}, hero.logo_image = ${data.hero?.logo_image}`);
      } catch(e) {}
    }
  }
  await pool.close();
}
run().catch(console.error);
