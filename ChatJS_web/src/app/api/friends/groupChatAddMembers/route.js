import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { conversationId, selectedFriends } = await request.json();
    const connection = await getConnection();

    selectedFriends.forEach((member) => {
      connection.execute(
        `INSERT INTO conversationusers (userId, conversationId) VALUES (?, ?)`,
        [member.userId, conversationId]
      );
    });

    await connection.end();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error occurred while adding members:", error);
    return NextResponse.json(
      {
        error: "Unable to add members",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
