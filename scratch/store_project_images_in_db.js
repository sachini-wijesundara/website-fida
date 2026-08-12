const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const sql = require("mssql");

require("@next/env").loadEnvConfig(process.cwd());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: process.env.DB_ENCRYPT !== "false",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
  },
};

const projects = [
  [1011, "Smart HRIS Implementation - Abans Environmental Services (Pvt) Ltd", "abans.png"],
  [1014, "LRDC Services", "lrdc.png"],
  [1015, "ACL Cables", "aclcables.png"],
  [1029, "Rotax Limited", "rotax.png"],
  [1030, "Commercial Insurance Brokers", "commercial.png"],
  [1031, "Agro Momentum", "agromomentum.png"],
  [1032, "Monaro", "monaro.png"],
];

const imageDirectory = path.join(process.cwd(), "public", "images", "client_project_images");

function toWebpDataUrl(fileName) {
  const source = path.join(imageDirectory, fileName);
  if (!fs.existsSync(source)) throw new Error(`Missing source image: ${source}`);

  const output = path.join(os.tmpdir(), `fida-project-${process.pid}-${fileName}.webp`);
  try {
    execFileSync("cwebp", ["-quiet", "-q", "82", source, "-o", output]);
    return `data:image/webp;base64,${fs.readFileSync(output).toString("base64")}`;
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
}

async function storeImages() {
  const encodedProjects = projects.map(([id, title, fileName]) => ({
    id,
    title,
    image: toWebpDataUrl(fileName),
  }));

  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    for (const project of encodedProjects) {
      const result = await new sql.Request(transaction)
        .input("Id", sql.Int, project.id)
        .input("Title", sql.NVarChar(255), project.title)
        .input("ImageUrl", sql.NVarChar(sql.MAX), project.image)
        .query(`
          UPDATE dbo.projects
          SET image_url = @ImageUrl,
              updated_at = GETDATE()
          WHERE id = @Id AND title = @Title;
        `);

      if (result.rowsAffected[0] !== 1) {
        throw new Error(`Expected exactly one matching project row for ID ${project.id}: ${project.title}`);
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  const verification = await pool.request().query(`
    SELECT id, title, LEFT(image_url, 23) AS image_prefix,
           DATALENGTH(image_url) AS image_bytes
    FROM dbo.projects
    WHERE id IN (${projects.map(([id]) => id).join(", ")})
    ORDER BY id;
  `);

  console.log(JSON.stringify(verification.recordset, null, 2));
  await pool.close();
}

storeImages().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
