import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { userId1, userId2, groupChatName, otherUsers } =
      await request.json();
    const connection = await getConnection();

    try {
      if (groupChatName) {
        const decodedGroup = decodeURIComponent(groupChatName);
        const [result] = await connection.execute(
          `INSERT INTO conversations (conversationName, isGroupChat) VALUES (?, ?)`,
          [decodedGroup, 1]
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

      const [existingConversation] = await connection.execute(
        `
        SELECT conversationName
        from conversations
        where conversationName = ?
        or conversationName = ?        
        `,
        [conversationName, user2Name + " and " + user1Name]
      );

      console.log(existingConversation);
      if (existingConversation.length > 0) {
        await connection.end();
        return NextResponse.json({
          conversationId: existingConversation[0].conversationId,
        });
      }

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

      const [conversation] = await connection.execute(
        `SELECT * FROM conversations WHERE conversationId = ?`,
        [result.insertId]
      );

      await connection.end();
      return NextResponse.json({
        conversationId: result.insertId,
        conversationName: conversation[0].conversationName,
        createdAt: conversation[0].createdAt,
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
