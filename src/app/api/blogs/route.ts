export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const category = searchParams.get('category');

    const pool = await getDbConnection();

    let result;
    if (isAdmin) {
      result = await pool.request().execute('sp_GetAllBlogs');
    } else if (category && category !== 'All') {
      result = await pool.request()
        .input('CategoryName', sql.NVarChar(50), category)
        .execute('sp_GetBlogsByCategory');
    } else {
      result = await pool.request().query(`
        SELECT 
          b.id, b.title, b.excerpt, b.image_url as imageUrl, b.status, b.created_at as date,
          c.name as cat, u.username as author
        FROM blogs b
        JOIN categories c ON b.category_id = c.id
        JOIN users u ON b.author_id = u.id
        WHERE b.status = 'Published'
        ORDER BY b.created_at DESC
      `);
    }


    // Map database fields to frontend fields for consistency
    const blogs = result.recordset.map((b: any) => ({
      ...b,
      imageUrl: b.image_url || b.imageUrl || "",
      date: b.created_at || b.date,
      cat: b.category_name || b.cat || category || "General",
      author: b.author_name || b.author || "Admin"
    }));

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("GET Blogs API FULL Error:", error);
    return NextResponse.json({ message: "Failed to fetch blogs", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { authorId, categoryId, title, excerpt, content, imageUrl, status } = data;

    const pool = await getDbConnection();

    const result = await pool.request()
      .input('AuthorId', sql.Int, authorId)
      .input('CategoryId', sql.Int, categoryId)
      .input('Title', sql.NVarChar(255), title)
      .input('Excerpt', sql.NVarChar(500), excerpt)
      .input('Content', sql.NVarChar(sql.MAX), content)
      .input('ImageUrl', sql.NVarChar(sql.MAX), imageUrl)
      .input('Status', sql.NVarChar(20), status || 'Draft')
      .execute('sp_CreateBlogPost');

    return NextResponse.json({
      message: "Blog post created successfully",
      blogId: result.recordset[0].BlogId
    });
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    return NextResponse.json({ message: "Failed to create blog", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('BlogId', sql.Int, id)
      .execute('sp_DeleteBlog');

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error: any) {
    console.error("Delete Blog Error:", error);
    return NextResponse.json({ message: "Failed to delete blog", error: error.message }, { status: 500 });
  }
}
