import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const connection = await getConnection();

        const [reports] = await connection.execute(
            "SELECT * FROM bugreports WHERE senderUserId = ? ORDER BY sentAt DESC",
            [userId]
        );

        await connection.end();

        return NextResponse.json({ result: reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}