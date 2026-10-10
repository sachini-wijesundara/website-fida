export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { cachedRequest, invalidateRequestCache } from "@/lib/request-cache";

export async function GET(request: Request) {
  try {
    const summary = new URL(request.url).searchParams.get("summary") === "true";
    const transformQuery = `
      SELECT
        id, name, position, bio, linkedin_url, twitter_url,
        accent, order_index, status,
        CASE
          WHEN image_url IS NOT NULL AND (image_url LIKE 'data:%' OR LEN(image_url) > 500) THEN CONCAT('/api/teams/', id, '/image')
          ELSE image_url
        END as image_url
      FROM team_members
      WHERE status <> 'Deleted' OR status IS NULL
      ORDER BY order_index ASC, id ASC
    `;

    
    if (summary) {
      const team = await cachedRequest("team-summaries", async () => {
        const pool = await getDbConnection();
        const result = await pool.request().query(transformQuery);
        return result.recordset;
      }, 60_000);
      return NextResponse.json(team);
    }

    const team = await cachedRequest("team-members", async () => {
      const pool = await getDbConnection();
      const result = await pool.request().query(transformQuery);
      return result.recordset;
    }, 60_000);
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
      .input('id', id ? parseInt(String(id), 10) : null)
      .input('name', name || '')
      .input('position', position || '')
      .input('bio', bio || '')
      .input('image_url', imageUrl || '')
      .input('linkedin_url', linkedinUrl || '')
      .input('twitter_url', twitterUrl || '')
      .input('accent', accent || '#38a3f5')
      .input('order_index', parseInt(String(orderIndex || 0), 10))
      .input('status', status || 'Active')
      .execute('sp_UpsertTeamMember');

    invalidateRequestCache("team-members");
    invalidateRequestCache("team-summaries");
    invalidateRequestCache("about-team-members");

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
      .input('id', parseInt(String(id), 10))
      .query(`UPDATE team_members SET status = 'Deleted' WHERE id = @id`);

    invalidateRequestCache("team-members");
    invalidateRequestCache("team-summaries");
    invalidateRequestCache("about-team-members");

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete team member", error: error.message }, { status: 500 });
  }
}
