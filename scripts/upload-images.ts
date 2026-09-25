import * as fs from 'fs';
import * as path from 'path';
import * as sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  requestTimeout: 60000,
  connectionTimeout: 60000,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

const files = [
  { file: 'products.png', title: 'homepageimages/products.png' },
  { file: 'years.png', title: 'homepageimages/years.png' },
  { file: 'coutries.png', title: 'homepageimages/coutries.png' },
  { file: 'clients.png', title: 'homepageimages/clients.png' },
];

async function upload() {
  try {
    const pool = await new sql.ConnectionPool(config).connect();
    console.log('Connected to SQL Server');

    for (const { file, title } of files) {
      const filePath = path.resolve(__dirname, '..', file);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        continue;
      }
      
      const ext = path.extname(file).slice(1);
      const mime = `image/${ext}`;
      const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
      const dataUri = `data:${mime};base64,${base64}`;

      // Check if exists
      const checkRes = await pool.request()
        .input('Title', title)
        .query(`SELECT id FROM dbo.Images WHERE title = @Title`);

      if (checkRes.recordset.length > 0) {
        // Update
        await pool.request()
          .input('Title', title)
          .input('ImageData', dataUri)
          .query(`UPDATE dbo.Images SET image_data = @ImageData WHERE title = @Title`);
        console.log(`Updated ${title}`);
      } else {
        // Insert
        await pool.request()
          .input('Title', title)
          .input('ImageData', dataUri)
          .query(`INSERT INTO dbo.Images (title, image_data) VALUES (@Title, @ImageData)`);
        console.log(`Inserted ${title}`);
      }
    }
    
    pool.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

upload();
