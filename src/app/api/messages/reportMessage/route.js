import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { messageId } = body;

    const connection = await getConnection();

    const query = "UPDATE messages SET isReported = 1 WHERE messageId = ?";

    await connection.execute(query, [messageId]);
    await connection.end();
    return NextResponse.json(
      { success: "Message reported successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to report message" },
      { status: 500 }
    );
  }
}
