import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, friendId } = body;

        const connection = await getConnection();

        const query = `
    INSERT INTO friendrequest (senderUserId, receiverUserId)
    VALUES (?, ?)
    `

        const [result] = await connection.execute(query, [userId, friendId]);

        return NextResponse.json({
            success: true,
            message: "Friend request sent successfully",
        }, { status: 200 })
    } catch (error) {
        console.error("Error adding friend:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 })
    }
}
