import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    const connenction = await getConnection();

    const query = `
SELECT 
    messages.messageId, 
    messages.conversationId,
    messages.senderUserId, 
    messages.messageText, 
    messages.sentAt,
    messages.state,
    messages.isDeleted,
    messages.isEdited,
    messages.replyTo,
    attachment.fileName,
    attachment.filePath,
    attachment.fileSize,
    users.displayName AS senderName,
    users.profilePicPath AS senderProfilePic
FROM 
    messages
LEFT JOIN 
    attachment ON messages.attachmentId = attachment.attachmentId
JOIN 
    users ON messages.senderUserId = users.userId
WHERE 
    messages.conversationId = ?
ORDER BY 
    messages.sentAt ASC;
    `;

    const [result] = await connenction.execute(query, [conversationId]);
    await connenction.end();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error occurred while retrieving messages:", error);
    return NextResponse.json(
      {
        error: "Unable to retrieve messages",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
