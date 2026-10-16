export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbConnection } from "@/lib/db";

// GET all careers for admin (active & inactive)
export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .query(
        "SELECT id, title, dept, type, location, color, is_active, details, created_at FROM careers ORDER BY created_at DESC"
      );

    return NextResponse.json(
      { success: true, data: result.recordset },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/admin/careers error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST create a new career entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, dept, type, location, color, is_active, details } = body;

    if (!title?.trim() || !dept?.trim() || !location?.trim() || !type?.trim()) {
      return NextResponse.json(
        { success: false, message: "Job title, department, location, and type are required" },
        { status: 400 }
      );
    }

    const themeColor = color || "#0047e1";
    const activeBit = is_active === false || is_active === 0 ? 0 : 1;

    const pool = await getDbConnection();
    await pool
      .request()
      .input("title", title.trim())
      .input("dept", dept.trim())
      .input("type", type.trim())
      .input("location", location.trim())
      .input("color", themeColor)
      .input("is_active", activeBit)
      .input("details", details ? details.trim() : null)
      .query(`
        INSERT INTO careers (title, dept, type, location, color, is_active, details, created_at)
        VALUES (@title, @dept, @type, @location, @color, @is_active, @details, GETDATE())
      `);

    try {
      revalidatePath("/careers");
      revalidatePath("/");
      revalidatePath("/admin/careers");
    } catch (e) {
      console.warn("Revalidation notice:", e);
    }

    return NextResponse.json({ success: true, message: "Career entry added successfully" });
  } catch (error: any) {
    console.error("POST /api/admin/careers error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT update an existing career entry
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, dept, type, location, color, is_active, details } = body;

    const jobId = parseInt(id, 10);
    if (isNaN(jobId) || jobId <= 0) {
      return NextResponse.json({ success: false, message: "Valid Career ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();

    // Verify existing record
    const check = await pool
      .request()
      .input("id", jobId)
      .query("SELECT id FROM careers WHERE id = @id");

    if (!check.recordset || check.recordset.length === 0) {
      return NextResponse.json({ success: false, message: "Career not found" }, { status: 404 });
    }

    const reqBuilder = pool.request().input("id", jobId);
    const setClauses: string[] = [];

    if (title !== undefined) {
      reqBuilder.input("title", title.trim());
      setClauses.push("title = @title");
    }
    if (dept !== undefined) {
      reqBuilder.input("dept", dept.trim());
      setClauses.push("dept = @dept");
    }
    if (type !== undefined) {
      reqBuilder.input("type", type.trim());
      setClauses.push("type = @type");
    }
    if (location !== undefined) {
      reqBuilder.input("location", location.trim());
      setClauses.push("location = @location");
    }
    if (color !== undefined) {
      reqBuilder.input("color", color);
      setClauses.push("color = @color");
    }
    if (is_active !== undefined) {
      const activeBit = is_active === false || is_active === 0 ? 0 : 1;
      reqBuilder.input("is_active", activeBit);
      setClauses.push("is_active = @is_active");
    }
    if (details !== undefined) {
      reqBuilder.input("details", details ? details.trim() : null);
      setClauses.push("details = @details");
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ success: false, message: "No fields provided to update" }, { status: 400 });
    }

    await reqBuilder.query(`
      UPDATE careers
      SET ${setClauses.join(", ")}
      WHERE id = @id
    `);

    try {
      revalidatePath("/careers");
      revalidatePath("/");
      revalidatePath("/admin/careers");
    } catch (e) {
      console.warn("Revalidation notice:", e);
    }

    return NextResponse.json({ success: true, message: "Job updated successfully" });
  } catch (error: any) {
    console.error("PUT /api/admin/careers error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  return PUT(req);
}

// DELETE a career entry
export async function DELETE(req: Request) {
  try {
    let id: any = null;
    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      // Body not provided or not JSON
    }

    if (!id) {
      const { searchParams } = new URL(req.url);
      id = searchParams.get("id");
    }

    const jobId = parseInt(id, 10);
    if (isNaN(jobId) || jobId <= 0) {
      return NextResponse.json({ success: false, message: "Valid Career ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool
      .request()
      .input("id", jobId)
      .query("DELETE FROM careers WHERE id = @id");

    try {
      revalidatePath("/careers");
      revalidatePath("/");
      revalidatePath("/admin/careers");
    } catch (e) {
      console.warn("Revalidation notice:", e);
    }

    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/admin/careers error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
