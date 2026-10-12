export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

// Helper to ensure table exists and has initial seed
async function ensureTable(pool: any) {
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='company_profile' AND xtype='U')
    BEGIN
      CREATE TABLE company_profile (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        version NVARCHAR(100),
        category NVARCHAR(100) DEFAULT 'Corporate Overview',
        description NVARCHAR(MAX),
        file_url NVARCHAR(1000) NOT NULL,
        file_name NVARCHAR(255),
        file_size NVARCHAR(50),
        is_active BIT DEFAULT 1,
        download_count INT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      );

      INSERT INTO company_profile (title, version, category, description, file_url, file_name, file_size, is_active)
      VALUES (
        'FIDA Global Corporate Profile 2026',
        '2026 Edition',
        'Corporate Overview',
        'Official comprehensive company profile covering FIDA Global services, enterprise solutions, Smart HRIS ecosystem, and client milestones.',
        '/Company%20Profile%202026.pdf',
        'Company Profile 2026.pdf',
        '62.9 MB',
        1
      );
    END
  `);
}

// GET: List all company profile records
export async function GET() {
  try {
    const pool = await getDbConnection();
    await ensureTable(pool);

    const result = await pool.request().query(`
      SELECT 
        id, 
        title, 
        version, 
        category, 
        description, 
        file_url, 
        file_name, 
        file_size, 
        is_active, 
        download_count, 
        created_at, 
        updated_at
      FROM company_profile 
      ORDER BY is_active DESC, updated_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: result.recordset || [],
    });
  } catch (error: any) {
    console.error("GET /api/admin/company-profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch company profiles" },
      { status: 500 }
    );
  }
}

// POST: Create a new company profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      version = "2026 Edition",
      category = "Corporate Overview",
      description = "",
      file_url,
      file_name = "Company Profile.pdf",
      file_size = "",
      is_active = false,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    if (!file_url || !file_url.trim()) {
      return NextResponse.json({ success: false, message: "File URL is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await ensureTable(pool);

    // Guard: Only 1 company profile allowed at a time
    const countCheck = await pool.request().query(`SELECT COUNT(*) as cnt FROM company_profile`);
    if (countCheck.recordset[0]?.cnt > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "A company profile already exists. You can replace, update, or delete the current profile." 
        }, 
        { status: 400 }
      );
    }

    const insertResult = await pool
      .request()
      .input("title", title.trim())
      .input("version", (version || "").trim())
      .input("category", (category || "Corporate Overview").trim())
      .input("description", (description || "").trim())
      .input("file_url", file_url.trim())
      .input("file_name", (file_name || "").trim())
      .input("file_size", (file_size || "").trim())
      .input("is_active", is_active ? 1 : 0)
      .query(`
        INSERT INTO company_profile (title, version, category, description, file_url, file_name, file_size, is_active, created_at, updated_at)
        OUTPUT INSERTED.*
        VALUES (@title, @version, @category, @description, @file_url, @file_name, @file_size, @is_active, GETDATE(), GETDATE())
      `);

    return NextResponse.json({
      success: true,
      message: "Company profile created successfully",
      data: insertResult.recordset[0],
    });
  } catch (error: any) {
    console.error("POST /api/admin/company-profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create company profile" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing company profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      version,
      category,
      description,
      file_url,
      file_name,
      file_size,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await ensureTable(pool);

    // If setting as active, mark other profiles inactive
    if (is_active) {
      await pool
        .request()
        .input("currentId", parseInt(String(id), 10))
        .query(`UPDATE company_profile SET is_active = 0 WHERE id <> @currentId`);
    }

    const updateResult = await pool
      .request()
      .input("id", parseInt(String(id), 10))
      .input("title", title.trim())
      .input("version", (version || "").trim())
      .input("category", (category || "Corporate Overview").trim())
      .input("description", (description || "").trim())
      .input("file_url", (file_url || "").trim())
      .input("file_name", (file_name || "").trim())
      .input("file_size", (file_size || "").trim())
      .input("is_active", is_active ? 1 : 0)
      .query(`
        UPDATE company_profile 
        SET 
          title = @title,
          version = @version,
          category = @category,
          description = @description,
          file_url = CASE WHEN @file_url = '' THEN file_url ELSE @file_url END,
          file_name = CASE WHEN @file_name = '' THEN file_name ELSE @file_name END,
          file_size = CASE WHEN @file_size = '' THEN file_size ELSE @file_size END,
          is_active = @is_active,
          updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (updateResult.recordset.length === 0) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Company profile updated successfully",
      data: updateResult.recordset[0],
    });
  } catch (error: any) {
    console.error("PUT /api/admin/company-profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update company profile" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a company profile record
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await ensureTable(pool);

    const deleteResult = await pool
      .request()
      .input("id", parseInt(id, 10))
      .query(`DELETE FROM company_profile WHERE id = @id`);

    if (deleteResult.rowsAffected[0] === 0) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Company profile deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/company-profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete company profile" },
      { status: 500 }
    );
  }
}
