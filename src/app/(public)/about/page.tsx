import AboutClient from "./about-client";
import { getDbConnection } from "@/lib/db";
import * as sql from "mssql";

export const metadata = {
  title: "About FIDA Global | IT & HR Technology Company",
  description: "Learn about FIDA Global's history, mission, and leadership team — a Sri Lankan tech company delivering HRIS, consultancy, and software since 2011.",
  keywords: "FIDA Global company, about FIDA Global, IT company Sri Lanka, HR technology company, Innovation, Best IT solution provider",
};

export default async function AboutPage() {
  let awardImageUrl = "/AWARD.png";
  try {
    const pool = await getDbConnection();
    const res = await pool.request()
      .input('key', sql.NVarChar, 'award_image')
      .query(`SELECT setting_value FROM site_settings WHERE setting_key = @key`);
    
    if (res.recordset.length > 0) {
      awardImageUrl = res.recordset[0].setting_value;
    }
  } catch (error) {
    console.error("Failed to fetch award image from DB:", error);
  }

  return (
    <main className="public-pastel-page min-h-screen">
      <AboutClient awardImageUrl={awardImageUrl} />
    </main>
  );
}
