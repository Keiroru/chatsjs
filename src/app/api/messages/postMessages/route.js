import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { conversationId, senderUserId, messageText, replyTo } = body;

        if (messageText.length > 20000) {
            return NextResponse.json({
                error: "Message too long",
            }, { status: 400 });
        }

        const valami = decodeURIComponent(messageText);

        const connection = await getConnection();

        const query = `
      INSERT INTO messages (conversationId, senderUserId, messageText, replyTo)
      VALUES (?, ?, ?, ?)
    `;

        const [result] = await connection.execute(query, [
            conversationId,
            senderUserId,
            valami.trim(),
            replyTo,
        ]);

        const [messages] = await connection.execute(
            `SELECT * FROM messages WHERE messageId = ?`,[result.insertId]
        );

        await connection.end();

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            data: messages[0]
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            {
                error: "Failed to send message",
                details: error.message,
            },
            { status: 500 }
        );
    }
}