import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { getConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          errors: [{ msg: "Email or phone number is required", path: "email" }],
        },
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
      ? "SELECT userId, password, isDeleted, isBanned FROM users WHERE telephone = ?"
      : "SELECT userId, password, isDeleted, isBanned FROM users WHERE email = ?";

    const [results] = await connection.execute(query, [email]);
    await connection.end();

    if (results.length === 0) {
      return NextResponse.json(
        { error: "incorrectEmailOrPhone" },
        { status: 401 }
      );
    }

    const { userId, password: storedHash, isDeleted, isBanned } = results[0];

    if (isDeleted === 1) {
      return NextResponse.json({ error: "accountDeleted" }, { status: 401 });
    }
    if (isBanned === 1) {
      return NextResponse.json({ error: "accountBanned" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, storedHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "incorrectPassword" },
        { status: 401 }
      );
    }

    const expiresIn = 60 * 60 * 24 * 7;
    const session = await createToken({ userId, expiresIn });

    const response = NextResponse.json(
      {
        message: "Login successful",
        userId: userId,
      },
      { status: 200 }
    );

    const cookieStore = await cookies(request);

    cookieStore.set("session", session, {
      maxAge: expiresIn,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    if (response.ok) {
      const querry = "UPDATE users SET isOnline = 1 WHERE userId = ?";
      const connection = await getConnection();

      await connection.execute(querry, [userId]);
      await connection.end();
    }
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
