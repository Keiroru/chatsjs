import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, userId } = body;

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        const connection = await getConnection();

        const [existingUsers] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.end();
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        const query = "UPDATE users SET email = ? WHERE userId = ?";

        await connection.execute(query, [email, userId]);
        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating email:", error);
        return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
    }
}
