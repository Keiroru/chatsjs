import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { senderUserId, receiverUserName, receiverDisplayId } =
      await request.json();

    const connection = await getConnection();

    const [receiverUser] = await connection.execute(
      `SELECT userId FROM users
       WHERE displayName = ? AND displayId = ?`,
      [receiverUserName, receiverDisplayId]
    );

    const receiverUserId = receiverUser[0].userId;

    if (senderUserId == receiverUserId) {
      return NextResponse.json(
        { error: "You cannot send a friend request to yourself" },
        { status: 400 }
      );
    }

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

    const query1 = `
    SELECT users.userId, users.displayName, users.displayId, users.profilePicPath
    FROM users
    WHERE users.userId = ?
    `;

    const [sender] = await connection.execute(query1, [senderUserId]);

    await connection.execute(query, [senderUserId, receiverUserId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Friend request sent",
      sender: sender[0],
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
