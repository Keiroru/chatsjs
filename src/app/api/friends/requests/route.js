import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const receiverUserId = searchParams.get("receiverUserId");

  try {
    const connection = await getConnection();

    const query = `
      SELECT 
        friendrequest.requestId,
        friendrequest.senderUserId,
        friendrequest.receiverUserId,
        friendrequest.isTimedOut,
        friendrequest.sentAt,
        Users.displayName,
        Users.email,
        Users.profilePicPath
      FROM friendrequest
      JOIN Users ON friendrequest.senderUserId = Users.userId
      WHERE friendrequest.receiverUserId = ?
      AND friendrequest.status = 'pending'
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
