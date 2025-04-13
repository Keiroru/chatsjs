import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) {
            return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
        }

        const connection = await getConnection();

        const [attachments] = await connection.execute(
            `SELECT attachment.* FROM attachment
             JOIN messages ON attachment.attachmentId = messages.attachmentId
             WHERE messages.conversationId = ?`,
            [conversationId]
        );


        await connection.end();
        return NextResponse.json(attachments);

    } catch (error) {
        console.error("Error in attachmentGet:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
