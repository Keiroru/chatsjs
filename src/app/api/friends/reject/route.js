import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const requestId = Number(body.requestId);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    const query = `
        UPDATE 
            FriendRequests 
        SET 
            status = 'declined' 
        WHERE 
            requestId = ?
      `;

    const [result] = await connection.execute(query, [requestId]);
    await connection.end();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return NextResponse.json(
        {
          error: "Failed to reject friend request",
          details: error.message,
        },
        { status: 500 }
      );
  }
}