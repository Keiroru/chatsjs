import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, desc, senderId } = body;

    const connection = await getConnection();

    const query = `
        INSERT INTO bugreports(senderUserId, header, description)
        VALUES(?,?,?)
        `;

    await connection.execute(query, [senderId, title, desc]);
    await connection.end();
    return NextResponse.json(
      {
        succes: true,
        message: "Report Sent Succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send Bug report",
      },
      { status: 500 }
    );
  }
}
