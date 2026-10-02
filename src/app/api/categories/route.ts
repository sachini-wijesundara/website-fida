export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { cachedRequest, invalidateRequestCache } from "@/lib/request-cache";

export async function GET() {
  try {
    const categories = await cachedRequest("categories", async () => {
      const pool = await getDbConnection();
      const result = await pool.request().query("SELECT id, name FROM categories ORDER BY name ASC");
      return result.recordset;
    }, 300_000);
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const name = data.name?.trim();
    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    // Check if category already exists
    const existing = await pool.request()
      .input("Name", name)
      .query("SELECT id, name FROM categories WHERE LOWER(name) = LOWER(@Name)");

    if (existing.recordset.length > 0) {
      return NextResponse.json(existing.recordset[0]);
    }

    const result = await pool.request()
      .input("Name", name)
      .query("INSERT INTO categories (name) OUTPUT INSERTED.id, INSERTED.name VALUES (@Name)");

    invalidateRequestCache("categories");

    return NextResponse.json(result.recordset[0], { status: 201 });
  } catch (error: any) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ message: "Failed to create category", error: error.message }, { status: 500 });
  }
}
