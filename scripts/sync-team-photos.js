const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const config = {
  user: 'sachini',
  password: 'sachni@34#45',
  server: '34.124.201.85',
  database: 'FIDAGLOBAL_COMPANYWEB',
  port: 35566,
  requestTimeout: 120000,
  connectionTimeout: 60000,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const TEAM_MAP = [
  { id: 1005, title: 'ourteam/upendra.png' },
  { id: 1006, title: 'ourteam/toshani.png' },
  { id: 2015, title: 'ourteam/charmi.png' },
  { id: 1007, title: 'ourteam/rukshan.png' },
  { id: 1009, title: 'ourteam/yuwanthi.png' },
  { id: 1010, title: 'ourteam/gihan.png' },
  { id: 2010, title: 'ourteam/isuru.png' },
];

async function main() {
  const pool = await sql.connect(config);
  console.log('Connected to SQL Server');

  // 1. Update dbo.Images for each team member using their active studio photo from team_members
  for (const item of TEAM_MAP) {
    const memberRes = await pool.request()
      .input('Id', item.id)
      .query('SELECT image_url, name FROM team_members WHERE id = @Id');

    if (memberRes.recordset.length > 0 && memberRes.recordset[0].image_url) {
      const { image_url, name } = memberRes.recordset[0];
      const req = pool.request();
      req.input('Title', sql.NVarChar(255), item.title);
      req.input('ImageData', sql.NVarChar(sql.MAX), image_url);
      
      // Upsert into dbo.Images: update if exists, insert if not
      await req.query(`
        IF EXISTS (SELECT 1 FROM dbo.Images WHERE title = @Title)
          UPDATE dbo.Images SET image_data = @ImageData WHERE title = @Title;
        ELSE
          INSERT INTO dbo.Images (title, image_data) VALUES (@Title, @ImageData);
      `);
      console.log(`Updated dbo.Images [${item.title}] for ${name} (${image_url.length} chars)`);
    } else {
      console.warn(`No image found in team_members for id: ${item.id}`);
    }
  }

  // Also update homepageimages/image3.png with Upendra's new photo
  const upendraRes = await pool.request().query("SELECT image_url FROM team_members WHERE id = 1005");
  if (upendraRes.recordset.length > 0) {
    const req = pool.request();
    req.input('Title', sql.NVarChar(255), 'homepageimages/image3.png');
    req.input('ImageData', sql.NVarChar(sql.MAX), upendraRes.recordset[0].image_url);
    await req.query("UPDATE dbo.Images SET image_data = @ImageData WHERE title = @Title");
    console.log('Updated dbo.Images [homepageimages/image3.png] with Upendra studio portrait');
  }

  // 2. Remove extinct / deleted rows from team_members
  const deletedResult = await pool.request()
    .query("DELETE FROM team_members WHERE status = 'Deleted'");
  console.log(`Removed extinct/deleted rows from team_members: ${deletedResult.rowsAffected[0]} rows`);

  // 3. Purge disk cache in .cache/fida-images
  const cacheDir = path.join(__dirname, '..', '.cache', 'fida-images');
  if (fs.existsSync(cacheDir)) {
    const files = fs.readdirSync(cacheDir);
    let count = 0;
    files.forEach(f => {
      // Remove ourteam and image3 cache files
      fs.unlinkSync(path.join(cacheDir, f));
      count++;
    });
    console.log(`Purged ${count} image cache files from ${cacheDir}`);
  }

  await pool.close();
  console.log('Team photos sync completed successfully!');
}

main().catch(err => {
  console.error('Error syncing team photos:', err);
  process.exit(1);
});
