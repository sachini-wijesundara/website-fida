export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const category = searchParams.get('category');

    const pool = await getDbConnection();

    let queryText = `
      SELECT 
        b.id, b.title, b.excerpt, b.status, b.created_at as date,
        b.order_index as orderIndex,
        CASE 
          WHEN b.image_url IS NOT NULL AND LEN(b.image_url) > 0 THEN CONCAT('/api/blogs/', b.id, '/image')
          ELSE ''
        END as imageUrl,
        c.name as cat, u.username as author
      FROM blogs b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.author_id = u.id
    `;

    if (!isAdmin) {
      queryText += ` WHERE b.status = 'Published'`;
      if (category && category !== 'All') {
        queryText += ` AND c.name = @CategoryName`;
      }
    } else if (category && category !== 'All') {
      queryText += ` WHERE c.name = @CategoryName`;
    }

    queryText += ` ORDER BY COALESCE(b.order_index, 999999) ASC, b.id DESC`;

    const req = pool.request();
    if (category && category !== 'All') {
      req.input('CategoryName', sql.NVarChar(50), category);
    }
    const result = await req.query(queryText);

    // Map database fields to frontend fields for consistency
    const blogs = (result.recordset || []).map((b: any) => {
      let imageUrl = b.image_url || b.imageUrl || "";
      if (imageUrl && (imageUrl.startsWith("data:image/") || imageUrl.length > 500)) {
        imageUrl = `/api/blogs/${b.id}/image`;
      }
      delete b.image_url;
      return {
        ...b,
        imageUrl,
        image_url: imageUrl,
        orderIndex: b.orderIndex ?? b.order_index ?? 999,
        date: b.created_at || b.date,
        cat: b.category_name || b.cat || category || "General",
        author: b.author_name || b.author || "Admin"
      };
    });

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

    const blogId = result.recordset[0].BlogId;

    // Shift all existing posts down and place newly added blog at position 1 (top of order)
    await pool.request()
      .input('NewBlogId', sql.Int, blogId)
      .query(`
        UPDATE blogs SET order_index = COALESCE(order_index, 0) + 1 WHERE id <> @NewBlogId;
        UPDATE blogs SET order_index = 1 WHERE id = @NewBlogId;
      `);

    return NextResponse.json({
      message: "Blog post created successfully",
      blogId
    });
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    return NextResponse.json({ message: "Failed to create blog", error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderedIds } = await request.json();
    if (Array.isArray(orderedIds)) {
      const pool = await getDbConnection();
      for (let i = 0; i < orderedIds.length; i++) {
        await pool.request()
          .input('Id', parseInt(orderedIds[i]))
          .input('OrderIndex', i + 1)
          .query('UPDATE blogs SET order_index = @OrderIndex WHERE id = @Id');
      }
      return NextResponse.json({ message: "Order updated successfully" });
    }
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  } catch (error: any) {
    console.error("Reorder Error:", error);
    return NextResponse.json({ message: "Failed to reorder", error: error.message }, { status: 500 });
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
