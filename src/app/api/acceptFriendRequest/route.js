import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  const requestId = await request.json();

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    const query = `
      UPDATE FriendRequests
      SET status = 'accepted'
      WHERE receiverUserId = ?
    `;

    await connection.execute(query, [requestId]);
    await connection.end();

    return NextResponse.json(
      { message: "Friend request accepted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to accept friend request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
