export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const pool = await getDbConnection();
    
    const result = await pool.request()
      .input('BlogId', parseInt(id))
      .execute('sp_GetBlogById');


    let b = result.recordset?.[0];
    if (!b) {
      const fallback = await pool.request()
        .input('BlogId', parseInt(id))
        .query(`
          SELECT 
            b.id, b.category_id, b.title, b.excerpt, b.content, b.status, b.image_url, b.created_at,
            u.username AS author_name, c.name AS category_name
          FROM blogs b
          LEFT JOIN users u ON b.author_id = u.id
          LEFT JOIN categories c ON b.category_id = c.id
          WHERE b.id = @BlogId
        `);
      b = fallback.recordset?.[0];
    }

    if (b) {
      let imageUrl = b.image_url || "";
      if (imageUrl && (imageUrl.startsWith("data:image/") || imageUrl.length > 500)) {
        imageUrl = `/api/blogs/${b.id}/image`;
      }
      // Delete multi-megabyte base64 string before returning JSON
      delete b.image_url;
      // Map to consistent frontend fields
      const blog = {
        ...b,
        imageUrl,
        image_url: imageUrl,
        date: b.created_at,
        cat: b.category_name || "General",
        author: b.author_name || "Admin"
      };
      return NextResponse.json(blog);
    } else {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Fetch Blog Single FULL Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const { categoryId, title, excerpt, content, imageUrl, status, orderIndex } = data;

    const pool = await getDbConnection();

    let finalImageUrl = imageUrl || null;
    if (imageUrl && imageUrl.startsWith("/api/blogs/")) {
      const existing = await pool.request()
        .input('BlogId', parseInt(id))
        .query('SELECT image_url FROM blogs WHERE id = @BlogId');
      finalImageUrl = existing.recordset?.[0]?.image_url || null;
    }
    
    // Call the provided update stored procedure
    const result = await pool.request()
      .input('BlogId', sql.Int, parseInt(id))
      .input('CategoryId', sql.Int, categoryId ? parseInt(categoryId) : null)
      .input('Title', sql.NVarChar(255), title || null)
      .input('Excerpt', sql.NVarChar(500), excerpt || null)
      .input('Content', sql.NVarChar(sql.MAX), content || null)
      .input('ImageUrl', sql.NVarChar(sql.MAX), finalImageUrl)
      .input('Status', sql.NVarChar(20), status || null)
      .execute('sp_UpdateBlogPost');

    if (orderIndex !== undefined && orderIndex !== null && orderIndex !== '') {
      await pool.request()
        .input('BlogId', parseInt(id))
        .input('OrderIndex', parseInt(orderIndex))
        .query('UPDATE blogs SET order_index = @OrderIndex WHERE id = @BlogId');
    }

    return NextResponse.json({ 
      message: "Blog updated successfully", 
      blog: result.recordset?.[0] 
    });
  } catch (error: any) {
    console.error("Update Blog FULL Error:", error);
    return NextResponse.json({ message: "Failed to update blog", error: error.message }, { status: 500 });
  }
}
