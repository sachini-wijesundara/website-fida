import { NextResponse } from "next/server";

// Handle Chrome DevTools probe cleanly to prevent 404/500 errors in development
export async function GET() {
  return NextResponse.json({}, { status: 200 });
}
