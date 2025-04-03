import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function DELETE(request) {
  try {
    const { userId, friendId } = await request.json();

    console.log(userId, friendId);

    const connection = await getConnection();

    const query = `
    DELETE FROM Friends
    WHERE (userId = ? AND friendUserId = ?)
       OR (userId = ? AND friendUserId = ?)
`;

    const query1 = `
    DELETE FROM FriendRequest 
    WHERE (senderUserId = ? AND receiverUserId = ?) OR (receiverUserId = ? AND senderUserId = ?)
    `;

    await connection.execute(query1, [userId, friendId, friendId, userId]);
    await connection.execute(query, [userId, friendId, friendId, userId]);
    await connection.end();
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete friend",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
