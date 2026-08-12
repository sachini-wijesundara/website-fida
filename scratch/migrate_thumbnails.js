const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

require("@next/env").loadEnvConfig(process.cwd());

const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 1433),
  options: { encrypt: true, trustServerCertificate: true },
};

function toWebpDataUrl(filePath) {
  
  const absolutePath = path.join(process.cwd(), "public", filePath.replace(/^\//, ''));
  if (!fs.existsSync(absolutePath)) {
    console.log(`File not found: ${absolutePath}`);
    return null;
  }
  
  const fileName = path.basename(absolutePath);
  const output = path.join(
    os.tmpdir(),
    `fida-thumb-${process.pid}-${fileName.replace(/[^a-z0-9]/gi, "-")}.webp`,
  );
  const args = ["-quiet", "-q", "80"];

  args.push(absolutePath, "-o", output);

  execFileSync("cwebp", args);
  const dataUrl = `data:image/webp;base64,${fs.readFileSync(output).toString("base64")}`;
  fs.unlinkSync(output);
  return dataUrl;
}

async function migrateThumbnails() {
  const pool = await sql.connect(config);
  
  // Fetch all existing rows
  const result = await pool.request().query(`SELECT id, thumbnail_image FROM dbo.solutions`);
  
  for (const row of result.recordset) {
    const thumb = row.thumbnail_image;
    // Only process rows where thumbnail_image is a URL (starts with /) and not already base64
    if (thumb && thumb.startsWith("/") && !thumb.startsWith("data:")) {
      console.log(`Processing ID ${row.id}: ${thumb}`);
      
      const base64Str = toWebpDataUrl(thumb);
      
      if (base64Str) {
        await pool.request()
          .input("Id", sql.Int, row.id)
          .input("ThumbnailImage", sql.NVarChar(sql.MAX), base64Str)
          .query(`
            UPDATE dbo.solutions
            SET thumbnail_image = @ThumbnailImage,
                updated_at = GETDATE()
            WHERE id = @Id;
          `);
        console.log(`Successfully updated ID ${row.id} to base64 WebP.`);
      }
    }
  }

  await pool.close();
  console.log("Migration complete!");
}

migrateThumbnails().catch((error) => {
  console.error(error);
  process.exit(1);
});
