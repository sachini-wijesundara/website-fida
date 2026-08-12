import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { verifyPassword } from "@/auth/password";
import { setSessionCookie } from "@/auth/cookies";
import { logAction } from "@/auth/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const pool = await getDbConnection();

    const result = await pool.request()
      .input("username", username)
      .query("SELECT id, username, password FROM users WHERE username = @username");

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const isPasswordValid = await verifyPassword(password, user.password);

      if (isPasswordValid) {
        const response = NextResponse.json({
          message: "Login successful",
          user: { id: user.id, username: user.username },
        });

        setSessionCookie(response.cookies);
        logAction(user.id, "login", { username: user.username });

        return response;
      }
    }

    // Generic message to avoid leaking whether the username exists
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });

  } catch (error: any) {
    console.error("[login] Error:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
