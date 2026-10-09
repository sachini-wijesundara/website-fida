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

async function main() {
  const newImagePath = path.join(__dirname, '..', 'public', 'dashabords.png');
  if (!fs.existsSync(newImagePath)) {
    console.error('File not found:', newImagePath);
    process.exit(1);
  }

  const buffer = fs.readFileSync(newImagePath);
  const base64Data = buffer.toString('base64');
  const dataUri = `data:image/png;base64,${base64Data}`;
  console.log(`Image read successfully. Size: ${buffer.length} bytes, Base64 URI len: ${dataUri.length}`);

  const pool = await sql.connect(config);
  console.log('Connected to SQL Server');

  // Search existing image records matching frame04 or dashabord
  const queryResult = await pool.request()
    .query("SELECT id, title, LEN(image_data) as len FROM dbo.Images WHERE title LIKE '%frame04%' OR title LIKE '%dashabord%' OR title LIKE '%dashboard%'");
  console.log('Matching existing records:', queryResult.recordset);

  // We want to update or replace the showcase dashboard image:
  // title: 'homepageimages/frame04.png'
  const title = 'homepageimages/frame04.png';

  // Delete old record(s)
  await pool.request()
    .input('Title', title)
    .query('DELETE FROM dbo.Images WHERE title = @Title');
  console.log(`Deleted old record with title: ${title}`);

  // Also delete any existing 'homepageimages/dashabords.png' or 'dashabords.png' if present
  await pool.request()
    .query("DELETE FROM dbo.Images WHERE title = 'homepageimages/dashabords.png' OR title = 'dashabords.png'");

  // Insert the new image with title 'homepageimages/frame04.png'
  const req = pool.request();
  req.input('Title', sql.NVarChar(255), title);
  req.input('ImageData', sql.NVarChar(sql.MAX), dataUri);
  await req.query('INSERT INTO dbo.Images (title, image_data, created_at) VALUES (@Title, @ImageData, GETDATE())');
  console.log(`Inserted new image record into dbo.Images with title: ${title}`);

  // Also insert with title 'homepageimages/dashabords.png' just in case
  const req2 = pool.request();
  req2.input('Title', sql.NVarChar(255), 'homepageimages/dashabords.png');
  req2.input('ImageData', sql.NVarChar(sql.MAX), dataUri);
  await req2.query('INSERT INTO dbo.Images (title, image_data, created_at) VALUES (@Title, @ImageData, GETDATE())');
  console.log(`Also inserted alias record into dbo.Images with title: homepageimages/dashabords.png`);

  // Clear disk cache in .cache/fida-images
  const diskCacheDir = path.join(__dirname, '..', '.cache', 'fida-images');
  if (fs.existsSync(diskCacheDir)) {
    const titlesToClear = [title, 'homepageimages/dashabords.png', 'dashabords.png'];
    const files = fs.readdirSync(diskCacheDir);
    for (const f of files) {
      fs.unlinkSync(path.join(diskCacheDir, f));
    }
    console.log(`Cleared all ${files.length} cache files in:`, diskCacheDir);
  }

  await pool.close();
  console.log('Update completed successfully!');
}

main().catch(err => {
  console.error('Error during image update:', err);
  process.exit(1);
});
