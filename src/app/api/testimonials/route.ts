export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetTestimonials');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch testimonials", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, clientName, clientPosition, clientCompany, content, imageUrl, rating, status } = data;
    const pool = await getDbConnection();

    await pool.request()
      .input('id', id || null)
      .input('client_name', clientName)
      .input('client_position', clientPosition)
      .input('client_company', clientCompany)
      .input('content', content)
      .input('image_url', imageUrl)
      .input('rating', rating || 5)
      .input('status', status || 'Active')
      .execute('sp_UpsertTestimonial');

    return NextResponse.json({ message: "Testimonial saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to save testimonial", error: error.message }, { status: 500 });
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
      .input('id', id)
      .query(`UPDATE testimonials SET status = 'Deleted' WHERE id = @id`); // Soft delete

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete testimonial", error: error.message }, { status: 500 });
  }
}
