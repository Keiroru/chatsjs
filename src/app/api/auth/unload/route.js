import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const query = "UPDATE users SET isOnline = 0 WHERE userId = ?";
    const connection = await getConnection();

    await connection.execute(query, [userId]);
    await connection.end();


    const response = NextResponse.json({ message: "Logged out" });
    return response;
}