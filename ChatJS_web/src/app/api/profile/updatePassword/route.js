import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { hashPassword } from "@/lib/func";

export async function POST(request) {
    try {
        const body = await request.json();
        const { password, userId } = body;

        if (!password) {
            return NextResponse.json({ error: "Password is required" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
        }

        if (!/[a-z]/.test(password)) {
            return NextResponse.json({ error: "Password must contain at least one lowercase letter" }, { status: 400 });
        }

        if (!/[A-Z]/.test(password)) {
            return NextResponse.json({ error: "Password must contain at least one uppercase letter" }, { status: 400 });
        }

        if (!/[0-9]/.test(password)) {
            return NextResponse.json({ error: "Password must contain at least one number" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const connection = await getConnection();
        const query = "UPDATE users SET password = ? WHERE userId = ?";
        await connection.execute(query, [hashedPassword, userId]);
        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }
}