import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { userId1, userId2, isGroupChat } = await request.json();

    const connection = await getConnection();

    try {
      if (isGroupChat) {
        const [existingConversation] = await connection.execute(
          `SELECT conversations.conversationId 
                     FROM conversations 
                     WHERE conversations.conversationId = ?
                     LIMIT 1`,
          [userId2]
        );

        await connection.end();
        if (existingConversation.length > 0) {
          return NextResponse.json({
            conversationId: existingConversation[0].conversationId,
          });
        } else {
          return NextResponse.json({
            conversationId: null,
          });
        }
      } else {
        const [existingConversation] = await connection.execute(
          `SELECT conversations.conversationId 
                     FROM conversations 
                     JOIN conversationusers conversationUserOne ON conversations.conversationId = conversationUserOne.conversationId
                     JOIN conversationusers conversationUserTwo ON conversations.conversationId = conversationUserTwo.conversationId
                     WHERE conversationUserOne.userId = ? AND conversationUserTwo.userId = ?
                     AND conversations.isGroupChat = 0
                     LIMIT 1`,
          [userId1, userId2]
        );

        const [blockedUser] = await connection.execute(
          `SELECT * FROM blocked WHERE userId = ? AND blockedUserId = ? OR blockedUserId = ? AND userId = ?`,
          [userId1, userId2, userId1, userId2]
        );

        await connection.end();
        if (existingConversation.length > 0 && blockedUser.length > 0) {
          return NextResponse.json({
            conversationId: existingConversation[0].conversationId,
            blocked: blockedUser[0].blockedUserId,
            blocker: blockedUser[0].userId,
          });
        } else if (existingConversation.length > 0) {
          return NextResponse.json({
            conversationId: existingConversation[0].conversationId,
          });
        } else {
          return NextResponse.json({
            conversationId: null,
          });
        }
      }
    } catch (error) {
      console.error("Conversation error:", error);
      return NextResponse.json(
        { error: "Failed to get conversation", details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to get connection", details: error.message },
      { status: 500 }
    );
  }
}
