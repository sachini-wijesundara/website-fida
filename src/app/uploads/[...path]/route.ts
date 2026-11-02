import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const relativePath = params.path.join("/");
    const decoded = decodeURIComponent(relativePath);

    // Prevent directory traversal
    if (decoded.includes("..") || decoded.startsWith("/") || decoded.includes("\\")) {
      return new NextResponse(null, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, decoded);

    const ext = path.extname(decoded).toLowerCase();
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    const fileBuffer = await fs.readFile(filePath);

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    };

    if (mimeType === "application/pdf") {
      const fileName = path.basename(decoded);
      headers["Content-Disposition"] = `inline; filename="${fileName}"`;
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    return new NextResponse(null, { status: 404 });
  }
}
