import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { isLookingForFriends, userId } = body;

        const connection = await getConnection();

        const query = "UPDATE users SET isLookingForFriends = ? WHERE userId = ?";

        await connection.execute(query, [isLookingForFriends, userId]);
        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating looking for friends:", error);
        return NextResponse.json({ error: "Failed to update looking for friends" }, { status: 500 });
    }
}