export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const relativePath = `uploads/${filename}`;
    
    // Convert to base64 data URI
    const b64 = buffer.toString("base64");
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${b64}`;

    // Insert into DB
    const pool = await getDbConnection();
    await pool.request()
      .input("Title", relativePath)
      .input("Data", dataUri)
      .query(`INSERT INTO dbo.Images (title, image_data, created_at) VALUES (@Title, @Data, GETDATE())`);

    const fileUrl = `/api/images/${relativePath}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
