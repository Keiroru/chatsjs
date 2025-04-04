import { getConnection } from "@/lib/db";
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const requestId = Number(body.requestId);

    const connection = await getConnection();

    const query = `
        UPDATE 
            friendrequest
        SET 
            status = 'rejected' 
        WHERE 
            requestId = ?
      `;

    const [result] = await connection.execute(query, [requestId]);
    await connection.end();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return NextResponse.json(
      {
        error: "Failed to reject friend request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
