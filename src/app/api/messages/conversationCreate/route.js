import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { userId1, userId2, groupChatName, otherUsers } =
      await request.json();
    const connection = await getConnection();

    try {
      if (groupChatName) {
        const [result] = await connection.execute(
          `INSERT INTO conversations (conversationName, isGroupChat) VALUES (?, ?)`,
          [groupChatName, 1]
        );

        otherUsers.forEach((user, index) => {
          connection.execute(
            `INSERT INTO conversationusers (userId, conversationId, isAdmin) VALUES (?, ?, ?)`,
            [user, result.insertId, index === 0 ? 1 : 0]
          );
        });

        await connection.end();
        return NextResponse.json({
          conversationId: result.insertId,
        });
      }

      const [existingConversation] = await connection.execute(
        `SELECT conversations.conversationId 
         FROM conversations 
         JOIN conversationusers cu1 ON conversations.conversationId = cu1.conversationId
         JOIN conversationusers cu2 ON conversations.conversationId = cu2.conversationId
         WHERE cu1.userId = ? AND cu2.userId = ? AND conversations.isGroupChat = 0
         LIMIT 1`,
        [userId1, userId2]
      );

      if (existingConversation.length > 0) {
        await connection.end();
        return NextResponse.json({
          conversationId: existingConversation[0].conversationId,
        });
      }

      const [user1] = await connection.execute(
        `SELECT displayName FROM users WHERE userId = ?`,
        [userId1]
      );
      const [user2] = await connection.execute(
        `SELECT displayName FROM users WHERE userId = ?`,
        [userId2]
      );

      const user1Name = user1[0].displayName;
      const user2Name = user2[0].displayName;
      const conversationName = `${user1Name} and ${user2Name}`;

      const [result] = await connection.execute(
        `INSERT INTO conversations (conversationName, isGroupChat) VALUES (?, ?)`,
        [conversationName, 0]
      );

      await connection.execute(
        `INSERT INTO conversationusers (userId, conversationId) VALUES (?, ?)`,
        [userId1, result.insertId]
      );
      await connection.execute(
        `INSERT INTO conversationusers (userId, conversationId) VALUES (?, ?)`,
        [userId2, result.insertId]
      );

      await connection.end();
      return NextResponse.json({
        conversationId: result.insertId,
      });
    } catch (error) {
      console.error("Conversation error:", error);
      await connection.end();
      return NextResponse.json(
        {
          error: "Failed to create conversation",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create connection", details: error.message },
      { status: 500 }
    );
  }
}
