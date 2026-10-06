import BlogClient from "./blog-client";
import { getDbConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog & Insights | FIDA Global",
  description: "Insights, deep dives, and expert commentary from the FIDA Global technology team.",
};

async function getPublishedBlogs() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT 
        b.id, b.title, b.excerpt, b.status, b.created_at as date,
        CASE 
          WHEN b.image_url IS NOT NULL AND LEN(b.image_url) > 0 THEN CONCAT('/api/blogs/', b.id, '/image')
          ELSE ''
        END as imageUrl,
        c.name as cat, u.username as author
      FROM blogs b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.status = 'Published'
      ORDER BY COALESCE(b.order_index, 999999) ASC, b.id DESC
    `);

    return (result.recordset || []).map((b: any) => ({
      id: b.id,
      title: b.title,
      excerpt: b.excerpt,
      imageUrl: b.imageUrl || "",
      date: b.date || b.created_at ? new Date(b.date || b.created_at).toISOString() : null,
      cat: b.cat || b.category_name || "General",
      author: b.author || b.author_name || "Admin",
    }));
  } catch (error) {
    console.error("Failed to fetch published blogs for SSR:", error);
    return [];
  }
}

export default async function BlogPage() {
  const initialBlogs = await getPublishedBlogs();

  return (
    <main className="public-pastel-page min-h-screen">
      <BlogClient initialBlogs={initialBlogs} />
    </main>
  );
}
