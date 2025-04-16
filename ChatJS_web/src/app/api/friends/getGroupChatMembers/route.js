import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    const connenction = await getConnection();

    const query = `
      SELECT 
          users.userId,
          users.displayName,
          users.displayId,
          users.profilePicPath,
          users.bio,
          users.isOnline,
          users.createdAt,
          conversationusers.isAdmin
        FROM 
          users
        JOIN 
          conversationusers ON users.userId = conversationusers.userId
        JOIN 
          conversations ON conversationusers.conversationId = conversations.conversationId
        WHERE 
          conversations.conversationId = ?
        ORDER BY 
          users.displayName
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
