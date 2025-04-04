import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    const body = await request.json();
    const { userId, friendId } = body;

    try {
        const connection = await getConnection();

        const querry = `
        DELETE FROM blocked
        WHERE userId = ? AND blockedUserId = ?
        `;

        const [result] = await connection.execute(querry, [userId, friendId]);
        connection.end();

        return NextResponse.json({
            message: "User unblocked successfully",
            succes: true,
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response('Error unblocking user', { status: 500 });
    }
}