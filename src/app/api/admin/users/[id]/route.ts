import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { hashPassword } from "@/auth/password";

// DELETE a user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const pool = await getDbConnection();
    
    await pool.request()
      .input("id", parseInt(id, 10))
      .query("DELETE FROM users WHERE id = @id");
      
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete User API Error:", error);
    return NextResponse.json({ message: "Failed to delete user", error: error.message }, { status: 500 });
  }
}

// UPDATE a user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { username, password } = await request.json();
    const pool = await getDbConnection();

    // Base query setup
    let updateQuery = "UPDATE users SET ";
    const requestPool = pool.request().input("id", parseInt(id, 10));
    
    const setClauses = [];

    // Fields that can be updated
    if (username !== undefined) {
      setClauses.push("username = @username");
      requestPool.input("username", username);
    }
    
    if (password) {
      const hashedPassword = await hashPassword(password);
      setClauses.push("password = @password");
      requestPool.input("password", hashedPassword);
    }

    // Only update if there are fields to update
    if (setClauses.length > 0) {
      updateQuery += setClauses.join(", ") + " WHERE id = @id";
      await requestPool.query(updateQuery);
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("Update User API Error:", error);
    return NextResponse.json({ message: "Failed to update user", error: error.message }, { status: 500 });
  }
}
