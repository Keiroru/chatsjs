import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const receiverUserId = searchParams.get("receiverUserId");

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    const query = `
      SELECT * FROM FriendRequests
      JOIN Users ON FriendRequests.senderUserId = Users.userId
      WHERE FriendRequests.receiverUserId = ?
      AND FriendRequests.status = 'pending'
    `;

    const [result] = await connection.execute(query, [receiverUserId]);
    await connection.end();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch friend requests",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
