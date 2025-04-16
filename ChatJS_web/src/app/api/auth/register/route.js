import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getRandomId, hashPassword } from "@/lib/func";

export async function POST(request) {
    try {
        const body = await request.json();
        const { displayName, email, telephone, password } = body;

        const errors = [];

        const trimmedDisplayName = decodeURIComponent(displayName.trim());
        let hasConsecutiveSpaces = /\s{2,}/.test(trimmedDisplayName);
        if (hasConsecutiveSpaces) {
            errors.push({
                msg: "noSpaces",
                path: "displayName"
            });
        }
        else if (!trimmedDisplayName || trimmedDisplayName.length < 4) {
            errors.push({
                msg: "displayNameShort",
                path: "displayName"
            });
        }
        else if (trimmedDisplayName.length > 20) {
            errors.push({
                msg: "displayNameLong",
                path: "displayName"
            });
        }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            errors.push({
                msg: "validEmail",
                path: "email"
            });
        }

        if (!password || password.length < 8 ||
            !/[a-z]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)) {
            errors.push({
                msg: "validPassword",
                path: "password"
            });
        }

        if (errors.length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const connection = await getConnection();

        const [existingUsers] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.end();
            return NextResponse.json(
                { errors: [{ msg: "emailExists", path: "email" }] },
                { status: 400 }
            );
        }

        const [existingPhoneUser] = await connection.execute(
            "SELECT * FROM users WHERE telephone = ?",
            [telephone]
        );

        if (existingPhoneUser.length > 0) {
            await connection.end();
            return NextResponse.json(
                { errors: [{ msg: "phoneExists", path: "telephone" }] },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const randomId = await getRandomId(connection, trimmedDisplayName);
        if (telephone == "") {
            const query = `INSERT INTO users (displayName, displayId, email, password)
            VALUES (?, ?, ?, ?)`;

            await connection.execute(query, [trimmedDisplayName, randomId, email, hashedPassword]);
        } else {
            const query = `INSERT INTO users (displayName, displayId, email, telephone, password)
            VALUES (?, ?, ?, ?, ?)`;

            await connection.execute(query, [trimmedDisplayName, randomId, email, telephone, hashedPassword]);
        }
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
