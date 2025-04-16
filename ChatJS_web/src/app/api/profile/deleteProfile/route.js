import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId } = body;

        const connection = await getConnection();
        const query = "UPDATE users SET isDeleted = 1 WHERE userId = ?";
        await connection.execute(query, [userId]);
        await connection.end();

        return NextResponse.json({
            success: true,
            message: "Profile deleted successfully.",
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete profile. Please try again.",
        }, { status: 500 });
    }
}