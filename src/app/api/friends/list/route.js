import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    const query = `
        SELECT 
            Users.userId, 
            Users.displayName, 
            Users.createdAt,
            Users.isOnline, 
            Users.bio,
            Users.profilePicPath
        FROM 
            Users
        JOIN 
            Friends ON Friends.friendUserId = Users.userId 
        WHERE 
            Friends.userId = ?
        ORDER BY 
            Users.displayName
      `;

    const [rows] = await connection.execute(query, [userId]);
    await connection.end();

    const contacts = rows.map((contact) => ({
      ...contact,
      lastMessage: "No messages",
      lastMessageTime: null,
    }));

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch contacts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
