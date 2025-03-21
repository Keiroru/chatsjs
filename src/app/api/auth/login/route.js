import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { getConnection } from "@/lib/db";
import bcrypt from 'bcrypt';  // Import bcrypt

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

        // Query to select the user based on email or phone
        const query = isPhone
            ? "SELECT userId, password FROM users WHERE telephone = ?"
            : "SELECT userId, password FROM users WHERE email = ?";

        const [results] = await connection.execute(query, [email]);
        await connection.end();

        if (results.length === 0) {
            return NextResponse.json(
                { error: "Incorrect email or phone number" },
                { status: 401 }
            );
        }

        const { userId, password: storedHash } = results[0];

        const isPasswordValid = await bcrypt.compare(password, storedHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 401 }
            );
        }

        const expiresIn = 60 * 60 * 24 * 7; // 7 days in seconds
        const session = await createToken({ userId, expiresIn });

        const response = NextResponse.json(
            { message: "Login successful" },
            { status: 200 }
        );

        // Set the session cookie
        response.cookies.set("session", session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Secure cookie in production
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
