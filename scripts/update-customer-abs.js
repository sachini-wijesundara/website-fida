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
  const imagePath = path.join(__dirname, '..', 'public', 'abs security.png');
  if (!fs.existsSync(imagePath)) {
    console.error('File not found:', imagePath);
    process.exit(1);
  }

  const buffer = fs.readFileSync(imagePath);
  const base64Data = buffer.toString('base64');
  const dataUri = `data:image/png;base64,${base64Data}`;
  console.log(`Image read successfully. Size: ${buffer.length} bytes`);

  const pool = await sql.connect(config);
  console.log('Connected to SQL Server');

  // 1. Check existing Aitken Spence customer
  const checkCustomer = await pool.request()
    .query("SELECT id, name, order_index FROM dbo.Customers WHERE name LIKE '%Aitken%' OR name LIKE '%Spence%' OR id = 1011");
  console.log('Customer to replace:', checkCustomer.recordset);

  // 2. Update the customer record in dbo.Customers
  if (checkCustomer.recordset.length > 0) {
    const custId = checkCustomer.recordset[0].id;
    const req = pool.request();
    req.input('Id', sql.Int, custId);
    req.input('Name', sql.NVarChar(255), 'ABS Securitas');
    req.input('LogoUrl', sql.NVarChar(sql.MAX), dataUri);
    await req.query("UPDATE dbo.Customers SET name = @Name, logo_url = @LogoUrl, updated_at = GETDATE() WHERE id = @Id");
    console.log(`Successfully updated customer ID ${custId} to ABS Securitas with the new logo!`);
  } else {
    // If not found by name, insert or update order_index 26
    const req = pool.request();
    req.input('Name', sql.NVarChar(255), 'ABS Securitas');
    req.input('LogoUrl', sql.NVarChar(sql.MAX), dataUri);
    req.input('OrderIndex', sql.Int, 26);
    req.input('Status', sql.NVarChar(20), 'Active');
    await req.query("INSERT INTO dbo.Customers (name, logo_url, order_index, status, created_at, updated_at) VALUES (@Name, @LogoUrl, @OrderIndex, @Status, GETDATE(), GETDATE())");
    console.log('Inserted new customer ABS Securitas at order_index 26');
  }

  // 3. Save also in dbo.Images
  const imgTitles = ['customer_logos/abs-security.png', 'abs security.png'];
  for (const title of imgTitles) {
    await pool.request()
      .input('Title', title)
      .query('DELETE FROM dbo.Images WHERE title = @Title');
    
    const imgReq = pool.request();
    imgReq.input('Title', sql.NVarChar(255), title);
    imgReq.input('ImageData', sql.NVarChar(sql.MAX), dataUri);
    await imgReq.query('INSERT INTO dbo.Images (title, image_data, created_at) VALUES (@Title, @ImageData, GETDATE())');
    console.log(`Saved logo in dbo.Images with title: ${title}`);
  }

  // Also remove any Aitken Spence image in dbo.Images if exists
  await pool.request().query("DELETE FROM dbo.Images WHERE title LIKE '%Aitken%' OR title LIKE '%Spence%'");

  await pool.close();
  console.log('All operations completed successfully!');
}

main().catch(err => {
  console.error('Error during customer update:', err);
  process.exit(1);
});
