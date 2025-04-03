import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { senderUserId, receiverUserName, receiverDisplayId } =
      await request.json();

    const connection = await getConnection();

    const [receiverUser] = await connection.execute(
      `SELECT userId FROM users
       WHERE BINARY displayName = ? AND displayId = ?`,
      [receiverUserName, receiverDisplayId]
    );

    const receiverUserId = receiverUser[0].userId;

    const query = `
      INSERT INTO FriendRequest (senderUserId, receiverUserId)
      VALUES (?, ?)
    `;

    const query1 = `
    SELECT 
        users.userId, 
        users.displayName, 
        users.displayId, 
        users.profilePicPath, 
        users.isOnline, 
        users.bio, 
        users.createdAt
    FROM 
        users
    WHERE 
        users.userId = ?;
    `;

    const [sender] = await connection.execute(query1, [senderUserId]);

    console.log(sender);

    await connection.execute(query, [senderUserId, receiverUserId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Friend request sent",
      sender: sender,
      receiverUserId: receiverUserId,
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
