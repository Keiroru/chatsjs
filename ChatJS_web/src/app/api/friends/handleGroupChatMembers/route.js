import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { memberId, conversationId, type } = await request.json();

    const connection = await getConnection();

    let query = "";

    if (type === "kick") {
      query = `
      DELETE FROM conversationusers
      WHERE userId = ? AND conversationId = ?;
    `;
    } else {
      query = `
      UPDATE conversationusers
      SET isAdmin = IF(isAdmin = 1, 0, 1)
      WHERE userId = ? AND conversationId = ?;
    `;
    }

    const [result] = await connection.execute(query, [
      memberId,
      conversationId,
    ]);

    await connection.end();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error occurred updating member:", error);
    return NextResponse.json(
      {
        error: "Unable to update member",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
