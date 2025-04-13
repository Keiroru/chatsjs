import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { getConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import fetch from "node-fetch";

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

    if (results.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "incorrectEmailOrPhone" },
        { status: 401 }
      );
    }

    const { userId, password: storedHash, isDeleted, isBanned } = results[0];

    if (isDeleted === 1) {
      await connection.end();
      return NextResponse.json({ error: "accountDeleted" }, { status: 401 });
    }

    if (isBanned === 1) {
      await connection.end();
      return NextResponse.json({ error: "accountBanned" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, storedHash);

    if (!isPasswordValid) {
      await connection.end();
      return NextResponse.json({ error: "incorrectPassword" }, { status: 401 });
    }

    const expiresIn = 60 * 60 * 24 * 7;
    const session = await createToken({ userId, expiresIn });

    const headerList = await headers();
    const userAgentRaw = headerList.get("user-agent") || "unknown";
    const parser = new UAParser(userAgentRaw);
    const parsed = parser.getResult();

    const browserName = parsed.browser.name || "Unknown Browser";
    const userAgent = browserName;
    const ipAddress =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    const deviceType = /mobile/i.test(userAgentRaw) ? "mobile" : "desktop";

    let location = "unknown";
    try {
      // const geoRes = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const geoRes = await fetch(`https://ipapi.co/94.21.42.34/json/`);
      const geoData = await geoRes.json();

      if (geoData && geoData.city && geoData.country_name) {
        location = `${geoData.city}, ${geoData.country_name}`;
      } else if (geoData && geoData.country_name) {
        location = geoData.country_name;
      }
    } catch (err) {
      console.error("Geo lookup failed:", err);
    }

    const osName = parsed.os.name || "Unknown OS";
    const osVersion = parsed.os.version || "";
    const deviceModel =
      parsed.device.model || parsed.device.vendor || "Unknown Device";
    const deviceName = `${deviceModel} ${osName} ${osVersion}`.trim();

    const [loginResult] = await connection.execute(
      `INSERT INTO logins (userId, location, ipAddress, deviceType, userAgent, deviceName)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, location, ipAddress, deviceType, userAgent, deviceName]
    );

    const loginId = loginResult.insertId;

    await connection.execute("UPDATE users SET isOnline = 1 WHERE userId = ?", [
      userId,
    ]);

    await connection.end();

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
    cookieStore.set("loginId", String(loginId), {
      maxAge: expiresIn,
      httpOnly: false,
      sameSite: "strict",
      secure: true,
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
