import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { senderUserId, receiverUserId } = await request.json();

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    const query = `
          INSERT INTO FriendRequests (senderUserId, receiverUserId)
          VALUES (?, ?)
        `;

    const [result] = await connection.execute(query, [
      senderUserId,
      receiverUserId,
    ]);
    await connection.end();

    return NextResponse.json({ success: true, message: "Friend request sent" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to send friend request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
