const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const config = {
  user: 'sachini',
  password: 'sachni@34#45',
  server: '34.124.201.85',
  database: 'FIDAGLOBAL_COMPANYWEB',
  port: 35566,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function uploadCareersImage() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');

    const imagePath = path.join(__dirname, '..', 'public', 'images', 'careers', 'office.png');
    const imageJpgPath = path.join(__dirname, '..', 'public', 'images', 'careers', 'office.jpg');

    const jpgBuffer = fs.readFileSync(imageJpgPath);
    const jpgBase64 = jpgBuffer.toString('base64');
    const jpgDataUri = `data:image/jpeg;base64,${jpgBase64}`;

    const pngBuffer = fs.readFileSync(imagePath);
    const pngBase64 = pngBuffer.toString('base64');
    const pngDataUri = `data:image/png;base64,${pngBase64}`;

    const targets = [
      { title: 'careers_banner.png', data: jpgDataUri },
      { title: 'careers/office.png', data: pngDataUri },
      { title: 'CAREERSpg.png', data: pngDataUri }
    ];

    for (const { title, data } of targets) {
      const checkRes = await pool.request()
        .input('Title', title)
        .query('SELECT id FROM dbo.Images WHERE title = @Title');

      if (checkRes.recordset.length > 0) {
        await pool.request()
          .input('Title', title)
          .input('ImageData', data)
          .query('UPDATE dbo.Images SET image_data = @ImageData, created_at = GETDATE() WHERE title = @Title');
        console.log(`Updated dbo.Images for: ${title}`);
      } else {
        await pool.request()
          .input('Title', title)
          .input('ImageData', data)
          .query('INSERT INTO dbo.Images (title, image_data, created_at) VALUES (@Title, @ImageData, GETDATE())');
        console.log(`Inserted dbo.Images for: ${title}`);
      }
    }

    await pool.close();
    console.log('Upload completed successfully!');
  } catch (err) {
    console.error('Error uploading image to DB:', err);
    process.exit(1);
  }
}

uploadCareersImage();
