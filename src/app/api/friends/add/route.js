import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { senderUserId, receiverUserId } = await request.json();

    console.log(
      "senderUserId:",
      senderUserId,
      "receiverUserId:",
      receiverUserId
    );
    if (senderUserId == receiverUserId) {
      return NextResponse.json(
        { error: "You cannot send a friend request to yourself" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [existing] = await connection.execute(
      `SELECT * FROM FriendRequest
       WHERE (senderUserId = ? AND receiverUserId = ?)
       OR (senderUserId = ? AND receiverUserId = ?)`,
      [senderUserId, receiverUserId, receiverUserId, senderUserId]
    );

    if (existing.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Friend request already exists!" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO FriendRequest (senderUserId, receiverUserId)
      VALUES (?, ?)
    `;

    await connection.execute(query, [senderUserId, receiverUserId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Friend request sent",
    });
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
