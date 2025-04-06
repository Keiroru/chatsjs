import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const body = await request.json();
        const { displayName, email, telephone, password } = body;

        const errors = [];

        const trimmedDisplayName = decodeURIComponent(displayName.trim());
        let hasConsecutiveSpaces = /\s{2,}/.test(trimmedDisplayName);
        if (hasConsecutiveSpaces) {
            errors.push({
                msg: "Can't have two or more spaces next to each other",
                path: "displayName"
            });
        }
        else if (!trimmedDisplayName || trimmedDisplayName.length < 4) {
            errors.push({
                msg: "Display name must be at least 4 characters long",
                path: "displayName"
            });
        }
        else if (trimmedDisplayName.length > 20) {
            errors.push({
                msg: "Display name can't be more than 20 characters long",
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
                msg: "Password must be at least 8 characters long and must contain lowercase, uppercase, and number",
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
                { errors: [{ msg: "Email already exists", path: "email" }] },
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
                { errors: [{ msg: "Phone number already in use", path: "telephone" }] },
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

    async function getRandomId(connection, displayName) {
        console.log("displayName:", displayName);
        const [existingIds] = await connection.execute(
            "SELECT displayId FROM users WHERE displayName = ?",
            [displayName]
        );

        if (existingIds.length > 10000) {
            await connection.end();
            return NextResponse.json(
                { errors: [{ msg: "Too many users with this name", path: "displayName" }] },
                { status: 121 }
            );
        } else {
            let array = [];
            let setArray = new Set(existingIds);

            for (let i = 0; i < 10000; i++) {
                array.push(String(i).padStart(4, '0'));
            }

            let filteredArray = array.filter(num => !setArray.has(num));

            let rndNum = Math.floor(Math.random() * filteredArray.length);

            return filteredArray[rndNum];
        }
    }

    async function hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            console.error("Error hashing password:", error);
            throw new Error("Unable to hash password");
        }
    }
}
