export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { cachedRequest } from "@/lib/request-cache";

export async function GET() {
  try {
    const dashboard = await cachedRequest("admin-dashboard-stats", async () => {
      const pool = await getDbConnection();
      const result = await pool.request().query(`
        SELECT
          (SELECT COUNT(*) FROM dbo.blogs) AS blogs,
          (SELECT COUNT(*) FROM dbo.projects WHERE status <> 'Deleted' OR status IS NULL) AS projects,
          (SELECT COUNT(*) FROM dbo.expertise) AS expertise,
          (SELECT COUNT(*) FROM dbo.users) AS users,
          (SELECT COUNT(*) FROM dbo.customers) AS customers;

        SELECT TOP (5) title, created_at, status
        FROM dbo.blogs
        ORDER BY created_at DESC;
      `);
      const recordsets = result.recordsets as any[];
      return {
        stats: recordsets[0][0],
        recentBlogs: recordsets[1],
      };
    }, 30_000);

    return NextResponse.json({
      stats: dashboard.stats,
      recentBlogs: dashboard.recentBlogs,
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
  }
}
