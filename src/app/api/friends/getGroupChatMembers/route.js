import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    const connenction = await getConnection();

    const query = `
      SELECT 
          Users.userId,
          Users.displayName,
          Users.displayId,
          Users.profilePicPath,
          Users.bio,
          Users.isOnline,
          Users.createdAt
        FROM 
          Users
        JOIN 
          Conversationusers ON Users.userId = Conversationusers.userId
        JOIN 
          Conversations ON Conversationusers.conversationId = Conversations.conversationId
        WHERE 
          Conversations.conversationId = ?
        ORDER BY 
          Users.displayName
    `;
    
    const [result] = await connenction.execute(query, [conversationId]);
    await connenction.end();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error occurred while getting members:", error);
    return NextResponse.json(
      {
        error: "Unable to get members",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
