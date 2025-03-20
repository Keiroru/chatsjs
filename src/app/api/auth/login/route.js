import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { getConnection } from "@/lib/db";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { errors: [{ msg: "Email or phone number is required", path: "email" }] },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { errors: [{ msg: "Password is required", path: "password" }] },
                { status: 400 }
            );
        }

        const isPhone = /^\d+$/.test(email);
        const connection = await getConnection();

        const query = isPhone
            ? "SELECT userId FROM users WHERE telephone = ? AND password = ?"
            : "SELECT userId FROM users WHERE email = ? AND password = ?";

        const [results] = await connection.execute(query, [email, password]);
        await connection.end();

        if (results.length === 0) {
            return NextResponse.json(
                { error: "Incorrect Email, Phone Number or Password!" },
                { status: 401 }
            );
        }

        const { userId } = results[0];
        const expiresIn = 60 * 60 * 24 * 7; // 7 days in seconds
        const session = await createToken({ userId, expiresIn });

        const response = NextResponse.json(
            { message: "Login successful" },
            { status: 200 }
        );

        response.cookies.set("session", session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresIn,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}