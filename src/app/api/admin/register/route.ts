import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { hashPassword } from "@/auth/password";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
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
    // Handle RAISERROR from SQL Server
    const statusCode = error.message.includes('already taken') ? 409 : 500;
    return NextResponse.json({ message: error.message }, { status: statusCode });
  }
}
