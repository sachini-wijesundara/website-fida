export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import path from "path";

const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg",
  ".pdf", ".doc", ".docx"
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // Rate Limit: Max 15 uploads per 10 minutes per IP
    const { allowed } = rateLimit(`upload:${clientIp}`, {
      limit: 15,
      windowMs: 10 * 60 * 1000,
    });

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many upload attempts. Please try again later." },
        { status: 429 }
      );
    }

    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds maximum permitted size of 10MB" },
        { status: 400 }
      );
    }

    // 2. Extension Whitelist Validation
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Allowed: Images (.jpg, .png, .webp, .svg) and Documents (.pdf, .docx)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename to prevent directory traversal
    const safeBaseName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeBaseName}`;
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
