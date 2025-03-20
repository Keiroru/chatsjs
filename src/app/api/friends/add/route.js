import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

/**
 * GET - Fetch pending friend requests for a user
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const receiverUserId = searchParams.get("receiverUserId");

  if (!receiverUserId) {
    return NextResponse.json(
      { error: "receiverUserId is required" },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();

    const query = `
      SELECT 
        FriendRequests.requestId,
        FriendRequests.senderUserId,
        FriendRequests.receiverUserId,
        FriendRequests.status,
        FriendRequests.createdAt,
        Users.displayName,
        Users.email,
        Users.profileImage
      FROM FriendRequests
      JOIN Users ON FriendRequests.senderUserId = Users.userId
      WHERE FriendRequests.receiverUserId = ?
      AND FriendRequests.status = 'pending'
    `;

    const [result] = await connection.execute(query, [receiverUserId]);
    await connection.end();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch friend requests",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Send a new friend request
 */
export async function POST(request) {
  try {
    const { senderUserId, receiverUserId } = await request.json();

    if (!senderUserId || !receiverUserId) {
      return NextResponse.json(
        { error: "senderUserId and receiverUserId are required" },
        { status: 400 }
      );
    }

    // Prevent sending request to self
    if (senderUserId === receiverUserId) {
      return NextResponse.json(
        { error: "Cannot send friend request to yourself" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Check if request already exists
    const [existing] = await connection.execute(
      `SELECT * FROM FriendRequests 
       WHERE (senderUserId = ? AND receiverUserId = ?)
       OR (senderUserId = ? AND receiverUserId = ?)`,
      [senderUserId, receiverUserId, receiverUserId, senderUserId]
    );

    if (existing.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Friend request already exists or you're already friends" },
        { status: 400 }
      );
    }

    // Insert new friend request
    const query = `
      INSERT INTO FriendRequests (senderUserId, receiverUserId)
      VALUES (?, ?)
    `;

    await connection.execute(query, [senderUserId, receiverUserId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Friend request sent"
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to send friend request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}