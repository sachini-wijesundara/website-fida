export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { hashPassword } from "@/auth/password";
import { getSession } from "@/auth/session";

export async function POST(request: NextRequest) {
  try {
    // Only logged-in administrators can create new admin accounts
    const session = getSession(request);
    if (!session || !session.isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized. Admin authentication required to register users." },
        { status: 401 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const pool = await getDbConnection();
    
    // Hash the password for safety using centralized utility
    const hashedPassword = await hashPassword(password);
    const trimmedUsername = username.trim();

    // Call the stored procedure provided by the user
    const result = await pool.request()
      .input('Username', trimmedUsername)
      .input('Password', hashedPassword)
      .execute('sp_CreateUser');

    if (result.recordset.length > 0) {
      const newUser = result.recordset[0];
      return NextResponse.json({ 
        message: "User created successfully", 
        user: newUser 
      });
    } else {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Register API Error:", error);
    const statusCode = error.message.includes('already taken') ? 409 : 500;
    return NextResponse.json({ message: error.message }, { status: statusCode });
  }
}
