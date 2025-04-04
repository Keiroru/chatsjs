import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { messageId, newMessage } = body;

    console.log("Editing message:", messageId, newMessage);

    const connection = await getConnection();

    const query = `
            UPDATE messages
            SET messageText = ?, isEdited = 1
            WHERE messageId = ?
        `;

    const [result] = await connection.execute(query, [newMessage, messageId]);
    await connection.end();

    return NextResponse.json(
      {
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating message", error: error.message },
      { status: 500 }
    );
  }
}
