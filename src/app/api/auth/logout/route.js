import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const cookieStore = cookies();
  const loginId = cookieStore.get("loginId")?.value;

  if (!userId || !loginId) {
    return NextResponse.json(
      { error: "Missing userId or loginId" },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.execute("UPDATE users SET isOnline = 0 WHERE userId = ?", [
      userId,
    ]);

    await connection.execute(
      `DELETE FROM logins WHERE loginId = ? AND userId = ?`,
      [loginId, userId]
    );

    const response = NextResponse.json({ message: "Logged out" });

    response.cookies.set("session", "", {
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("loginId", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
