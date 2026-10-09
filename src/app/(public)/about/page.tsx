import AboutClient from "./about-client";
import { getDbConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About FIDA Global | IT & HR Technology Company",
  description: "Learn about FIDA Global's history, mission, and leadership team — a Sri Lankan tech company delivering HRIS, consultancy, and software since 2011.",
  keywords: "FIDA Global company, about FIDA Global, IT company Sri Lanka, HR technology company, Innovation, Best IT solution provider",
};

import { cachedRequest } from "@/lib/request-cache";

async function getTeamMembers() {
  return cachedRequest("about-team-members", async () => {
    try {
      const pool = await getDbConnection();
      const result = await pool.request().query(`
        SELECT 
          id, name, position, linkedin_url, twitter_url, accent, order_index,
          CASE WHEN image_url IS NOT NULL AND LEN(image_url) > 0 THEN 1 ELSE 0 END as has_image
        FROM team_members 
        WHERE status <> 'Deleted' OR status IS NULL 
        ORDER BY order_index ASC, id ASC
      `);

      if (result.recordset && result.recordset.length > 0) {
        return result.recordset.map((m: any, idx: number) => ({
          id: m.id,
          name: m.name,
          role: m.position,
          image: m.has_image ? `/api/teams/${m.id}/image` : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'Team')}&background=052c65&color=fff&size=512`,
          linkedin: m.linkedin_url,
          twitter: m.twitter_url,
          accent: m.accent,
          order: m.order_index ?? idx,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch team members for about page:", error);
    }
    return [];
  }, 60_000);
}

async function getAwardImage() {
  return cachedRequest("about-award-image", async () => {
    try {
      const pool = await getDbConnection();
      const settingsRes = await pool.request().execute("sp_GetAllSiteSettings");
      const found = settingsRes.recordset?.find((r: any) => r.setting_key === "award_image");
      if (found?.setting_value) return found.setting_value;
    } catch (error) {
      console.error("Failed to fetch site settings for award image:", error);
    }
    return "/AWARD.JPG";
  }, 60_000);
}

export default async function AboutPage() {
  const [initialTeam, awardImage] = await Promise.all([
    getTeamMembers(),
    getAwardImage(),
  ]);

  return (
    <main className="public-pastel-page min-h-screen">
      <AboutClient initialTeam={initialTeam} initialAwardImage={awardImage} />
    </main>
  );
}
