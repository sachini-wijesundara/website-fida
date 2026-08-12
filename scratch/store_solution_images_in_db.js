const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 1433),
  options: { encrypt: true, trustServerCertificate: true },
};

const imagePairs = [
  ["access-control-attendance", "accesscontrolpic1.png", "access controlpic2.png"],
  ["business-consultancy", "bposervices1.png", "bposervicespic2.png"],
  ["task-manager", "taskmanagerpic1.png", "taskmanagerpic2.png"],
  ["helpdesk", "helpdeskpic1.png", "helpdeskpic2.png"],
];

const imageDirectory = path.join(process.cwd(), "public", "solutionsdetailpics");

function toWebpDataUrl(fileName) {
  const source = path.join(imageDirectory, fileName);
  const output = path.join(
    os.tmpdir(),
    `fida-solution-${process.pid}-${fileName.replace(/[^a-z0-9]/gi, "-")}.webp`,
  );
  const args = ["-quiet", "-q", "80"];

  if (fileName.startsWith("helpdesk")) args.push("-resize", "1200", "0");
  args.push(source, "-o", output);

  execFileSync("cwebp", args);
  const dataUrl = `data:image/webp;base64,${fs.readFileSync(output).toString("base64")}`;
  fs.unlinkSync(output);
  return dataUrl;
}

async function storeImages() {
  const encodedPairs = imagePairs.map(([slug, first, second]) => ({
    slug,
    first: toWebpDataUrl(first),
    second: toWebpDataUrl(second),
  }));

  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    await new sql.Request(transaction).query(`
      ALTER TABLE dbo.solutions ALTER COLUMN detail_image_1 NVARCHAR(MAX) NULL;
      ALTER TABLE dbo.solutions ALTER COLUMN detail_image_2 NVARCHAR(MAX) NULL;
    `);

    for (const pair of encodedPairs) {
      const result = await new sql.Request(transaction)
        .input("Slug", sql.NVarChar(100), pair.slug)
        .input("Image1", sql.NVarChar(sql.MAX), pair.first)
        .input("Image2", sql.NVarChar(sql.MAX), pair.second)
        .query(`
          UPDATE dbo.solutions
          SET detail_image_1 = @Image1,
              detail_image_2 = @Image2,
              updated_at = GETDATE()
          WHERE slug = @Slug;
        `);

      if (result.rowsAffected[0] !== 1) {
        throw new Error(`Expected one solution row for slug: ${pair.slug}`);
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  const verification = await pool.request().query(`
    SELECT slug,
           LEFT(detail_image_1, 23) AS image_1_prefix,
           DATALENGTH(detail_image_1) AS image_1_bytes,
           LEFT(detail_image_2, 23) AS image_2_prefix,
           DATALENGTH(detail_image_2) AS image_2_bytes
    FROM dbo.solutions
    WHERE slug IN (
      N'access-control-attendance', N'business-consultancy', N'task-manager', N'helpdesk'
    )
    ORDER BY order_index;
  `);

  console.log(JSON.stringify(verification.recordset, null, 2));
  await pool.close();
}

storeImages().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
