import { getConnection } from "@/lib/db";
import next from "next";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId } = body;

        const connection = await getConnection();

        const query = `
        SELECT conversationId 
        FROM conversationusers
        WHERE userId = ?
        `

        const [results] = await connection.execute(query, [userId]);

        const conversationIds = results.map((row) => row.conversationId);

        await connection.end();

        return NextResponse.json({ conversationIds }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}