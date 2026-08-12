const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' || true,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true,
  },
  requestTimeout: 30000
};

async function inspect() {
  try {
    console.log("Connecting to database using server:", config.server);
    const pool = await sql.connect(config);
    console.log("Querying solutions...");
    const res = await pool.request().query("SELECT id, title, slug, template_data FROM Solutions");
    console.log(`Found ${res.recordset.length} solutions:`);
    for (const row of res.recordset) {
      console.log(`\n--- Solution ID: ${row.id}, Title: ${row.title}, Slug: ${row.slug} ---`);
      if (row.template_data) {
        try {
          const data = JSON.parse(row.template_data);
          console.log(JSON.stringify(data, null, 2));
        } catch (e) {
          console.log("Raw Template Data:", row.template_data);
        }
      } else {
        console.log("No template data");
      }
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

inspect();
