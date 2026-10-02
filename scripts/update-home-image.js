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
  const newImagePath = path.join(__dirname, '..', 'public', 'HR Analytics Meeting in a Modern Office.png');
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

  const title = 'solutions_images/homeLAST.png';

  // Ensure old record is gone
  await pool.request()
    .input('Title', title)
    .query('DELETE FROM dbo.Images WHERE title = @Title');
  console.log(`Deleted extinct record with title: ${title}`);

  // Insert new record with sql.NVarChar(sql.MAX)
  const req = pool.request();
  req.input('Title', sql.NVarChar(255), title);
  req.input('ImageData', sql.NVarChar(sql.MAX), dataUri);
  await req.query('INSERT INTO dbo.Images (title, image_data, created_at) VALUES (@Title, @ImageData, GETDATE())');
  console.log(`Inserted new image record into dbo.Images with title: ${title}`);

  // Clear disk cache
  const diskCacheDir = path.join(__dirname, '..', '.cache', 'fida-images');
  const safeKey = Buffer.from(title).toString('hex');
  const binFile = path.join(diskCacheDir, `${safeKey}.bin`);
  const metaFile = path.join(diskCacheDir, `${safeKey}.meta`);
  if (fs.existsSync(binFile)) fs.unlinkSync(binFile);
  if (fs.existsSync(metaFile)) fs.unlinkSync(metaFile);
  console.log('Cleared disk cache for:', title);

  await pool.close();
  console.log('Update completed successfully!');
}

main().catch(err => {
  console.error('Error during image update:', err);
  process.exit(1);
});
