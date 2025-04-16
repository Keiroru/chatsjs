import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { userId, conversationId, otherMembers } = await request.json();
    const connection = await getConnection();

    connection.execute(
      `DELETE FROM conversationusers WHERE userId = ? AND conversationId = ?`,
      [userId, conversationId]
    );

    if (otherMembers.length === 0) {
      console.log("No other members left in the group chat.");
      await connection.execute(
        `DELETE FROM messages WHERE conversationId = ?`,
        [conversationId]
      );

      await connection.execute(
        `DELETE FROM conversations WHERE conversationId = ?`,
        [conversationId]
      );
    } else {
      const hasAdmin = otherMembers.some((member) => member.isAdmin);
      if (!hasAdmin) {
        const newAdmin = otherMembers[0];
        console.log(newAdmin, "new admin", conversationId);
        await connection.execute(
          `UPDATE conversationusers SET isAdmin = 1 WHERE userId = ? AND conversationId = ?`,
          [newAdmin, conversationId]
        );
      }
    }

    await connection.end();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error occurred while leaving group chat:", error);
    return NextResponse.json(
      {
        error: "Unable to leave group chat",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
