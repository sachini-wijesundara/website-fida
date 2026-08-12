import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { cachedRequest } from "@/lib/request-cache";

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
