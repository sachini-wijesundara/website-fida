import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

let dbObjectsEnsured = false;

// Ensure table, seed data, and stored procedures exist
async function ensureDbObjects(pool: any) {
  if (dbObjectsEnsured) return;
  // 1. Ensure Table
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TermsAndConditions')
    BEGIN
        CREATE TABLE TermsAndConditions (
            id INT IDENTITY(1,1) PRIMARY KEY,
            title NVARCHAR(255) NOT NULL,
            slug NVARCHAR(255) NULL,
            content NVARCHAR(MAX) NOT NULL,
            status NVARCHAR(50) DEFAULT 'Draft',
            order_index INT DEFAULT 0,
            created_at DATETIME DEFAULT GETDATE(),
            updated_at DATETIME DEFAULT GETDATE()
        );
    END
  `);

  // 2. Ensure Stored Procedures
  await pool.request().query(`
    -- sp_GetAllTerms
    IF OBJECT_ID('sp_GetAllTerms', 'P') IS NULL
        EXEC('CREATE PROCEDURE sp_GetAllTerms AS BEGIN SET NOCOUNT ON; END');
  `);
  await pool.request().query(`
    ALTER PROCEDURE sp_GetAllTerms
        @All BIT = 0
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT id, title, slug, content, status, order_index, created_at, updated_at
        FROM TermsAndConditions
        WHERE (@All = 1 OR status = 'Published')
        ORDER BY order_index ASC, id ASC;
    END
  `);

  await pool.request().query(`
    -- sp_GetTermById
    IF OBJECT_ID('sp_GetTermById', 'P') IS NULL
        EXEC('CREATE PROCEDURE sp_GetTermById AS BEGIN SET NOCOUNT ON; END');
  `);
  await pool.request().query(`
    ALTER PROCEDURE sp_GetTermById
        @Id INT
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT id, title, slug, content, status, order_index, created_at, updated_at
        FROM TermsAndConditions
        WHERE id = @Id;
    END
  `);

  await pool.request().query(`
    -- sp_UpsertTerm
    IF OBJECT_ID('sp_UpsertTerm', 'P') IS NULL
        EXEC('CREATE PROCEDURE sp_UpsertTerm AS BEGIN SET NOCOUNT ON; END');
  `);
  await pool.request().query(`
    ALTER PROCEDURE sp_UpsertTerm
        @Id INT = NULL,
        @Title NVARCHAR(255),
        @Content NVARCHAR(MAX),
        @Status NVARCHAR(50) = 'Draft',
        @OrderIndex INT = 0
    AS
    BEGIN
        SET NOCOUNT ON;
        IF @Id IS NOT NULL AND EXISTS (SELECT 1 FROM TermsAndConditions WHERE id = @Id)
        BEGIN
            UPDATE TermsAndConditions
            SET title = @Title,
                content = @Content,
                status = @Status,
                order_index = @OrderIndex,
                updated_at = GETDATE()
            WHERE id = @Id;

            SELECT @Id AS Id, 'Updated' AS [Action];
        END
        ELSE
        BEGIN
            INSERT INTO TermsAndConditions (title, content, status, order_index, created_at, updated_at)
            VALUES (@Title, @Content, @Status, @OrderIndex, GETDATE(), GETDATE());

            SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id, 'Created' AS [Action];
        END
    END
  `);

  await pool.request().query(`
    -- sp_UpdateTermStatus
    IF OBJECT_ID('sp_UpdateTermStatus', 'P') IS NULL
        EXEC('CREATE PROCEDURE sp_UpdateTermStatus AS BEGIN SET NOCOUNT ON; END');
  `);
  await pool.request().query(`
    ALTER PROCEDURE sp_UpdateTermStatus
        @Id INT,
        @Status NVARCHAR(50)
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE TermsAndConditions
        SET status = @Status,
            updated_at = GETDATE()
        WHERE id = @Id;

        SELECT @Id AS Id, @Status AS [Status];
    END
  `);

  await pool.request().query(`
    -- sp_DeleteTerm
    IF OBJECT_ID('sp_DeleteTerm', 'P') IS NULL
        EXEC('CREATE PROCEDURE sp_DeleteTerm AS BEGIN SET NOCOUNT ON; END');
  `);
  await pool.request().query(`
    ALTER PROCEDURE sp_DeleteTerm
        @Id INT
    AS
    BEGIN
        SET NOCOUNT ON;
        DELETE FROM TermsAndConditions WHERE id = @Id;
        SELECT @Id AS Id;
    END
  `);

  // 3. Seed default 8 sections if empty
  const countRes = await pool.request().query("SELECT COUNT(*) as count FROM TermsAndConditions");
  if (countRes.recordset[0].count === 0) {
    const defaultSections = [
      {
        title: "1. Acceptance of Terms",
        order_index: 1,
        status: "Published",
        content: "<p>By accessing or using the website of <strong>FIDA Global (Private) Ltd</strong> (\"FIDA Global\", \"we\", \"us\", or \"our\"), including any associated enterprise software platforms (such as Smart HRIS), technical portals, or consultancy services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue your use of our website and services immediately.</p>"
      },
      {
        title: "2. Scope of Services & Access License",
        order_index: 2,
        status: "Published",
        content: "<p>FIDA Global provides enterprise IT consulting, custom software engineering, infrastructure support, and SaaS products. We grant users a limited, non-exclusive, non-transferable, and revocable license to access our public website for informational, evaluation, and business communication purposes.</p><p>Access to proprietary SaaS modules, including Smart HRIS, is further governed by specific Master Service Agreements (MSAs) and Service Level Agreements (SLAs) executed between FIDA Global and client organizations.</p>"
      },
      {
        title: "3. Intellectual Property Rights",
        order_index: 3,
        status: "Published",
        content: "<p>All content on this website, including but not limited to technical articles, architectural frameworks, logos, branding, graphics, source code, and design assets, is the exclusive intellectual property of <strong>FIDA Global (Private) Ltd</strong> or its licensors and is protected under national and international copyright, trademark, and intellectual property laws.</p>"
      },
      {
        title: "4. User Conduct & Acceptable Use",
        order_index: 4,
        status: "Published",
        content: "<p>You agree not to engage in any of the following prohibited activities:</p><ul><li>Attempting to bypass security systems, probe infrastructure vulnerabilities, or gain unauthorized access to servers, databases, or accounts.</li><li>Using automated scraping, crawling, or data extraction utilities without prior written authorization from FIDA Global.</li><li>Transmitting unsolicited advertising, spam, or malicious software (such as viruses or Trojans).</li><li>Using our platforms in any manner that infringes upon the rights of others or violates applicable laws and regulations.</li></ul>"
      },
      {
        title: "5. Disclaimer & Limitation of Liability",
        order_index: 5,
        status: "Published",
        content: "<p>While we strive to ensure that all information and services provided on this website are accurate and up to date, the website is offered on an \"as is\" and \"as available\" basis without warranties of any kind.</p><p>To the fullest extent permitted by law, FIDA Global shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or inability to use this website.</p>"
      },
      {
        title: "6. Privacy & Data Protection",
        order_index: 6,
        status: "Published",
        content: "<p>Your privacy is of utmost importance to us. Our data handling procedures, cookie practices, and GDPR compliance policies are detailed in our Privacy & Cookie Policy, which forms an integral part of these Terms of Service.</p>"
      },
      {
        title: "7. Governing Law & Jurisdiction",
        order_index: 7,
        status: "Published",
        content: "<p>These Terms of Service are governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law principles. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Sri Lanka, unless otherwise stipulated in a signed enterprise contract.</p>"
      },
      {
        title: "8. Enterprise Inquiries & Contact",
        order_index: 8,
        status: "Published",
        content: "<p>For legal inquiries, enterprise compliance questions, or contractual terms related to FIDA Global services, please contact our legal and administrative team directly at <strong>info@fidaglobal.com</strong> or phone <strong>+94 11 710 80 20</strong>.</p>"
      }
    ];

    for (const sec of defaultSections) {
      await pool.request()
        .input("Id", null)
        .input("Title", sec.title)
        .input("Content", sec.content)
        .input("Status", sec.status)
        .input("OrderIndex", sec.order_index)
        .execute("sp_UpsertTerm");
    }
  }
}

// GET: Fetch terms via Stored Procedure (sp_GetAllTerms or sp_GetTermById)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const id = searchParams.get("id");

    const pool = await getDbConnection();
    await ensureDbObjects(pool);

    if (id) {
      const res = await pool.request()
        .input("Id", parseInt(id))
        .execute("sp_GetTermById");

      if (!res.recordset || res.recordset.length === 0) {
        return NextResponse.json({ message: "Term not found" }, { status: 404 });
      }
      return NextResponse.json(res.recordset[0]);
    }

    const result = await pool.request()
      .input("All", all ? 1 : 0)
      .execute("sp_GetAllTerms");

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    console.error("GET Terms SP error:", error);
    return NextResponse.json({ message: "Failed to fetch terms", error: error.message }, { status: 500 });
  }
}

// POST: Create or Update a term via Stored Procedure (sp_UpsertTerm)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, status, order_index } = body;

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await ensureDbObjects(pool);

    const safeStatus = status === "Published" ? "Published" : "Draft";
    const safeOrder = parseInt(order_index) || 0;
    const safeId = id ? parseInt(id) : null;

    const result = await pool.request()
      .input("Id", safeId)
      .input("Title", title)
      .input("Content", content)
      .input("Status", safeStatus)
      .input("OrderIndex", safeOrder)
      .execute("sp_UpsertTerm");

    const returnedId = result.recordset?.[0]?.Id || safeId;
    const action = result.recordset?.[0]?.Action || (safeId ? "Updated" : "Created");

    return NextResponse.json({ 
      message: `Term ${action.toLowerCase()} successfully`, 
      id: returnedId 
    });
  } catch (error: any) {
    console.error("POST Terms SP error:", error);
    return NextResponse.json({ message: "Failed to save term", error: error.message }, { status: 500 });
  }
}

// PATCH: Quick update of status (Draft / Published) via Stored Procedure (sp_UpdateTermStatus)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ message: "ID and status are required" }, { status: 400 });
    }

    const safeStatus = status === "Published" ? "Published" : "Draft";

    const pool = await getDbConnection();
    await ensureDbObjects(pool);

    await pool.request()
      .input("Id", parseInt(id))
      .input("Status", safeStatus)
      .execute("sp_UpdateTermStatus");

    return NextResponse.json({ message: `Status updated to ${safeStatus}` });
  } catch (error: any) {
    console.error("PATCH Terms SP error:", error);
    return NextResponse.json({ message: "Failed to update status", error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a term via Stored Procedure (sp_DeleteTerm)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await ensureDbObjects(pool);

    await pool.request()
      .input("Id", parseInt(id))
      .execute("sp_DeleteTerm");

    return NextResponse.json({ message: "Term deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Terms SP error:", error);
    return NextResponse.json({ message: "Failed to delete term", error: error.message }, { status: 500 });
  }
}
