import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

// In-memory cache for customer list
let cachedCustomers: any = null;
let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (cachedCustomers && now - lastCacheTime < CACHE_TTL) {
      return NextResponse.json(cachedCustomers, {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
        },
      });
    }

    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllCustomers');
    
    // Auto-trim transparent borders so every logo can render at full optical size
    const sharp = (await import('sharp')).default;
    const processedCustomers = await Promise.all(
      result.recordset.map(async (c: any) => {
        if (!c.logo_url) return c;
        const matches = c.logo_url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches) return c;
        try {
          const buf = Buffer.from(matches[2], 'base64');
          const trimmed = await sharp(buf).trim().png().toBuffer();
          return {
            ...c,
            logo_url: `data:image/png;base64,${trimmed.toString('base64')}`,
          };
        } catch {
          return c;
        }
      })
    );

    cachedCustomers = processedCustomers;
    lastCacheTime = now;

    return NextResponse.json(cachedCustomers, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch customers", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, name, logoUrl, websiteUrl, orderIndex, status } = data;
    const pool = await getDbConnection();
    
    const result = await pool.request()
      .input('Id', sql.Int, id || null)
      .input('Name', sql.NVarChar(255), name)
      .input('LogoUrl', sql.NVarChar(sql.MAX), logoUrl)
      .input('WebsiteUrl', sql.NVarChar(sql.MAX), websiteUrl)
      .input('OrderIndex', sql.Int, orderIndex || 0)
      .input('Status', sql.NVarChar(20), status || 'Active')
      .execute('sp_UpsertCustomer');

    cachedCustomers = null;

    return NextResponse.json({ 
      message: id ? "Customer updated" : "Customer created", 
      customerId: result.recordset[0].CustomerId 
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
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_DeleteCustomer');

    cachedCustomers = null;

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete customer", error: error.message }, { status: 500 });
  }
}
