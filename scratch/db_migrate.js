const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    process.env[match[1]] = val;
  }
});
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: { encrypt: process.env.DB_ENCRYPT === 'true', trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' }
};

async function run() {
  let pool;
  try {
    pool = await sql.connect(config);
    console.log("Connected to DB.");

    // 1. Create Images table
    console.log("Creating Images table...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Images' AND xtype='U')
      CREATE TABLE Images (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255),
          description NVARCHAR(500),
          image_data NVARCHAR(MAX),
          created_at DATETIME DEFAULT GETDATE()
      )
    `);

    // 2. Add columns to Solutions table
    console.log("Adding columns to Solutions...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Solutions') AND name = 'badge')
      ALTER TABLE Solutions ADD badge NVARCHAR(50);
      
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Solutions') AND name = 'thumbnail_image')
      ALTER TABLE Solutions ADD thumbnail_image NVARCHAR(MAX);
    `);

    // 3. Move homepage images (id 2 to 9) to Images table
    console.log("Migrating data...");
    const oldData = await pool.request().query(`SELECT * FROM Solutions WHERE id >= 2 AND id <= 9`);
    if (oldData.recordset.length > 0) {
      for (const row of oldData.recordset) {
        await pool.request()
          .input('title', sql.NVarChar, row.title)
          .input('description', sql.NVarChar, row.description)
          .input('image_data', sql.NVarChar, row.detail_image_1 || null)
          .query(`INSERT INTO Images (title, description, image_data) VALUES (@title, @description, @image_data)`);
      }
      // Delete from Solutions
      await pool.request().query(`DELETE FROM Solutions WHERE id >= 2 AND id <= 9`);
    }

    // 4. Update the correct solutions with badge and thumbnail_image (Matching solutions-client.tsx)
    console.log("Updating proper solutions...");
    
    // 01 SMART HRIS
    const hasHris = await pool.request().query(`SELECT * FROM Solutions WHERE title LIKE '%SMART HRIS%'`);
    if (hasHris.recordset.length === 0) {
        await pool.request().query(`
          INSERT INTO Solutions (title, badge, description, thumbnail_image, order_index, status)
          VALUES ('SMART HRIS', 'SOFTWARE SOLUTION', 'Centralize human resources, payroll, and performance management into a single automated ecosystem built for growth.', '/images/solutions_images/smarthris.png', 1, 'Active')
        `);
    } else {
        await pool.request().query(`UPDATE Solutions SET badge = 'SOFTWARE SOLUTION', thumbnail_image = '/images/solutions_images/smarthris.png', description = 'Centralize human resources, payroll, and performance management into a single automated ecosystem built for growth.' WHERE title LIKE '%SMART HRIS%'`);
    }

    // 02 FIDA Task Manager (ID 12)
    await pool.request().query(`
      UPDATE Solutions SET badge = 'SOFTWARE SOLUTION', 
      thumbnail_image = '/images/solutions_images/taskmanager.png', 
      description = 'Streamline project workflows with intelligent task prioritization and real-time team synchronization across your entire organization.'
      WHERE title LIKE '%Task Manager%'
    `);

    // 03 Access Control & Attendance (ID 10)
    await pool.request().query(`
      UPDATE Solutions SET badge = 'ACCESS CONTROL', 
      thumbnail_image = '/images/solutions_images/attendance.png', 
      description = 'Enterprise-grade biometric security and automated attendance tracking for high-traffic environments and secure facilities.'
      WHERE title LIKE '%Access Control%'
    `);

    // 04 FIDA Helpdesk System (ID 13)
    await pool.request().query(`
      UPDATE Solutions SET badge = 'SOFTWARE SOLUTION', 
      thumbnail_image = '/images/solutions_images/helpdesk.png', 
      description = 'Resolution-focused support infrastructure designed for rapid deployment and high customer satisfaction rates.'
      WHERE title LIKE '%Helpdesk%'
    `);

    // 05 FIDA Business Consultancy (ID 11)
    await pool.request().query(`
      UPDATE Solutions SET badge = 'CONSULTANCY', 
      thumbnail_image = '/images/solutions_images/bpo&services.png', 
      description = 'Strategic advisory and digital transformation expertise to scale your enterprise operations with precision and clarity.'
      WHERE title LIKE '%Business Consultancy%'
    `);

    console.log("DB Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    if (pool) pool.close();
  }
}
run();
