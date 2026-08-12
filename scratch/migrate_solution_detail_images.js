const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const solutions = [
  {
    slug: "access-control-attendance",
    title: "Access Control & Attendance",
    description: "Secure access, accurate time tracking, and biometrically verified presence.",
    image1: "/solutionsdetailpics/accesscontrolpic1.png",
    image2: "/solutionsdetailpics/access controlpic2.png",
    orderIndex: 20,
  },
  {
    slug: "business-consultancy",
    title: "FIDA Business Consultancy",
    description: "Human-led strategic guidance for organizations facing challenges that technology alone cannot solve.",
    image1: "/solutionsdetailpics/bposervices1.png",
    image2: "/solutionsdetailpics/bposervicespic2.png",
    orderIndex: 21,
  },
  {
    slug: "task-manager",
    title: "FIDA Task Manager",
    description: "A visual, Kanban-style taskboard for organized workflows and clear team accountability.",
    image1: "/solutionsdetailpics/taskmanagerpic1.png",
    image2: "/solutionsdetailpics/taskmanagerpic2.png",
    orderIndex: 22,
  },
  {
    slug: "helpdesk",
    title: "FIDA Helpdesk System",
    description: "A cloud-based ticketing and support management system for internal service requests.",
    image1: "/solutionsdetailpics/helpdeskpic1.png",
    image2: "/solutionsdetailpics/helpdeskpic2.png",
    orderIndex: 23,
  },
];

async function migrate() {
  const pool = await sql.connect(config);

  await pool.request().query(`
    IF COL_LENGTH('dbo.solutions', 'slug') IS NULL
      ALTER TABLE dbo.solutions ADD slug NVARCHAR(100) NULL;

    IF COL_LENGTH('dbo.solutions', 'detail_image_1') IS NULL
      ALTER TABLE dbo.solutions ADD detail_image_1 NVARCHAR(500) NULL;

    IF COL_LENGTH('dbo.solutions', 'detail_image_2') IS NULL
      ALTER TABLE dbo.solutions ADD detail_image_2 NVARCHAR(500) NULL;
  `);

  for (const solution of solutions) {
    await pool.request()
      .input("Slug", sql.NVarChar(100), solution.slug)
      .input("Title", sql.NVarChar(255), solution.title)
      .input("Description", sql.NVarChar(500), solution.description)
      .input("Image1", sql.NVarChar(500), solution.image1)
      .input("Image2", sql.NVarChar(500), solution.image2)
      .input("OrderIndex", sql.Int, solution.orderIndex)
      .query(`
        IF EXISTS (SELECT 1 FROM dbo.solutions WHERE slug = @Slug)
        BEGIN
          UPDATE dbo.solutions
          SET title = @Title,
              description = @Description,
              detail_image_1 = COALESCE(detail_image_1, @Image1),
              detail_image_2 = COALESCE(detail_image_2, @Image2),
              order_index = @OrderIndex,
              status = N'Active',
              updated_at = GETDATE()
          WHERE slug = @Slug;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.solutions
            (title, description, icon_name, order_index, status, created_at, updated_at,
             slug, detail_image_1, detail_image_2)
          VALUES
            (@Title, @Description, N'Image', @OrderIndex, N'Active', GETDATE(), GETDATE(),
             @Slug, @Image1, @Image2);
        END
      `);
  }

  const result = await pool.request().query(`
    SELECT id, slug, title, detail_image_1, detail_image_2
    FROM dbo.solutions
    WHERE slug IS NOT NULL
    ORDER BY order_index, id;
  `);

  console.log(JSON.stringify(result.recordset, null, 2));
  await pool.close();
}

migrate().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
