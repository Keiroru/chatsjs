import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { conversationId, messageId } = body;

    if (!conversationId || !messageId) {
      return NextResponse.json(
        { error: "Conversation ID and Message ID are required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const query = `
      UPDATE messages
      SET state = 'seen'
      WHERE messageId = ? AND conversationId = ?
    `;

    const [result] = await connection.execute(query, [messageId, conversationId]);
    await connection.end();

    return NextResponse.json(
      { success: true, message: "Message marked as seen" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking message as seen:", error);
    return NextResponse.json(
      { error: "Failed to mark message as seen", details: error.message },
      { status: 500 }
    );
  }
}
