import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, friendId } = body;

    const connection = await getConnection();

    const check = `
        SELECT * FROM blocked WHERE userId = ? AND blockedUserId = ?
`;

    const [checkResult] = await connection.execute(check, [userId, friendId]);

    if (checkResult.length > 0) {
      return NextResponse.json({
        error: "Already blocked",
      });
    }

    const query = `
    INSERT INTO blocked (userId, blockedUserId)
    VALUES (?, ?)
    `;

    const [result] = await connection.execute(query, [userId, friendId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Friend blocked successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to block friend",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
