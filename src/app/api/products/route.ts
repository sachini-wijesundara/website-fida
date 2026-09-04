export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllProducts');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch products", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      id, tag, tagColor, title, subtitle, description, highlights, ctaText,
      imageUrl, dashboardImageUrl, mobileImageUrl, websiteUrl, orderIndex, status,
    } = data;
    const pool = await getDbConnection();
    
    const result = await pool.request()
      .input('Id', sql.Int, id || null)
      .input('Tag', sql.NVarChar(100), tag)
      .input('TagColor', sql.NVarChar(50), tagColor)
      .input('Title', sql.NVarChar(255), title)
      .input('Subtitle', sql.NVarChar(255), subtitle)
      .input('Description', sql.NVarChar(sql.MAX), description)
      .input('Highlights', sql.NVarChar(sql.MAX), typeof highlights === 'string' ? highlights : JSON.stringify(highlights))
      .input('CtaText', sql.NVarChar(100), ctaText)
      .input('ImageUrl', sql.NVarChar(sql.MAX), imageUrl || null)
      .input('DashboardImageUrl', sql.NVarChar(sql.MAX), dashboardImageUrl || null)
      .input('MobileImageUrl', sql.NVarChar(sql.MAX), mobileImageUrl || null)
      .input('WebsiteUrl', sql.NVarChar(sql.MAX), websiteUrl || null)
      .input('OrderIndex', sql.Int, orderIndex || 0)
      .input('Status', sql.NVarChar(20), status || 'Active')
      .execute('sp_UpsertProduct');

    return NextResponse.json({ 
      message: id ? "Product updated" : "Product created", 
      productId: result.recordset[0].ProductId 
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Operation failed", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_DeleteProduct');

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete product", error: error.message }, { status: 500 });
  }
}
