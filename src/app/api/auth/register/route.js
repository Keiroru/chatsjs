import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { displayName, email, telephone, password } = body;

        // Validation
        const errors = [];

        if (!displayName || displayName.length < 4) {
            errors.push({
                msg: "Display name must be at least 4 characters long",
                path: "displayName"
            });
        }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            errors.push({
                msg: "A valid email is required",
                path: "email"
            });
        }

        if (!password || password.length < 8 ||
            !/[a-z]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)) {
            errors.push({
                msg: "Password must be at least 8 characters long and contain lowercase, uppercase, and numbers",
                path: "password"
            });
        }

        if (errors.length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const connection = await getConnection();

        // Check for existing email
        const [existingUsers] = await connection.execute(
            "SELECT * FROM Users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.end();
            return NextResponse.json(
                { errors: [{ msg: "Email already exists", path: "email" }] },
                { status: 400 }
            );
        }

        // Insert new user
        const query = `
      INSERT INTO Users (displayName, email, telephone, password, status)
      VALUES (?, ?, ?, ?, 'active')
    `;

        await connection.execute(query, [displayName, email, telephone, password]);
        await connection.end();

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Database error", details: error.message },
            { status: 500 }
        );
    }
}