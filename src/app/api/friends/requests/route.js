import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const receiverUserId = searchParams.get("receiverUserId");

    if (!receiverUserId) {
        return NextResponse.json(
            { error: "receiverUserId is required" },
            { status: 400 }
        );
    }

    try {
        const connection = await getConnection();

        const query = `
      SELECT 
        FriendRequests.requestId,
        FriendRequests.senderUserId,
        FriendRequests.receiverUserId,
        FriendRequests.status,
        FriendRequests.sentAt,
        Users.displayName,
        Users.email,
        Users.profilePicPath
      FROM FriendRequests
      JOIN Users ON FriendRequests.senderUserId = Users.userId
      WHERE FriendRequests.receiverUserId = ?
      AND FriendRequests.status = 'pending'
    `;

        const [result] = await connection.execute(query, [receiverUserId]);
        await connection.end();

        return NextResponse.json(result);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch friend requests",
                details: error.message,
            },
            { status: 500 }
        );
    }
}