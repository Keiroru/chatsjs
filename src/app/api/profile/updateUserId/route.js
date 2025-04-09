import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, displayId, displayName } = body;

        const connection = await getConnection();

        const [existingUsers] = await connection.execute(
            "SELECT * FROM users WHERE displayId = ? AND displayName = ?",
            [displayId, displayName]
        );

        if (existingUsers.length > 0) {
            await connection.end();
            return NextResponse.json(
                { error: "This User ID is already taken" },
                { status: 400 }
            );
        }

        const query = "UPDATE users SET displayId = ? WHERE userId = ?";
        await connection.execute(query, [displayId, userId]);
        await connection.end();

        return NextResponse.json({ success: "User ID updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating user ID:", error);
        return NextResponse.json({ error: "Failed to update user ID" }, { status: 500 });
    }
}