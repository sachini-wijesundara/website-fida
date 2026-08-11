import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { cachedRequest, invalidateRequestCache } from "@/lib/request-cache";

export async function GET(request: Request) {
  try {
    const summary = new URL(request.url).searchParams.get("summary") === "true";
    if (summary) {
      const team = await cachedRequest("team-summaries", async () => {
        const pool = await getDbConnection();
        const result = await pool.request().query(`
          SELECT
            id, name, position, bio, linkedin_url, twitter_url,
            accent, order_index, status,
            CASE WHEN image_url LIKE 'data:%' THEN NULL ELSE image_url END AS image_url
          FROM team_members
          WHERE status <> 'Deleted' OR status IS NULL
          ORDER BY order_index ASC
        `);
        return result.recordset;
      });
      return NextResponse.json(team);
    }

    const team = await cachedRequest("team-members", async () => {
      const pool = await getDbConnection();
      const result = await pool.request().execute('sp_GetTeamMembers');
      return result.recordset;
    });
    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch team members", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, name, position, bio, imageUrl, linkedinUrl, twitterUrl, accent, orderIndex, status } = data;
    const pool = await getDbConnection();

    await pool.request()
      .input('id', sql.Int, id || null)
      .input('name', sql.NVarChar(255), name)
      .input('position', sql.NVarChar(255), position)
      .input('bio', sql.NVarChar(sql.MAX), bio)
      .input('image_url', sql.NVarChar(sql.MAX), imageUrl)
      .input('linkedin_url', sql.NVarChar(sql.MAX), linkedinUrl)
      .input('twitter_url', sql.NVarChar(sql.MAX), twitterUrl)
      .input('accent', sql.NVarChar(50), accent || "#38a3f5")
      .input('order_index', sql.Int, orderIndex || 0)
      .input('status', sql.NVarChar(50), status || 'Active')
      .execute('sp_UpsertTeamMember');

    invalidateRequestCache("team-members");
    invalidateRequestCache("team-summaries");

    return NextResponse.json({ message: "Team member saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to save team member", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`UPDATE team_members SET status = 'Deleted' WHERE id = @id`);

    invalidateRequestCache("team-members");
    invalidateRequestCache("team-summaries");

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete team member", error: error.message }, { status: 500 });
  }
}
