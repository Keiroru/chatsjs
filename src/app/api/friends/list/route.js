import { getConnection } from "@/lib/db";
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const tab = searchParams.get("tab");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    let query = "";
    if (tab === "people") {
      query = `
        SELECT 
          users.userId,
          users.displayName,
          users.displayId,
          users.profilePicPath,
          users.bio,
          users.isOnline,
          users.createdAt
        FROM 
          users
        WHERE 
          users.isLookingForFriends = 1
          AND users.userId != ?  -- Exclude the current user
          AND NOT EXISTS (
            SELECT 1 FROM friends 
            WHERE (friends.userId = ? AND friends.friendUserId = users.userId)
            OR (friends.userId = users.userId AND friends.friendUserId = ?)
          )
        ORDER BY 
          users.displayName
      `;
    } else if (tab === "groups") {
      query = `
        SELECT 
          conversations.conversationId,
          conversations.conversationName,
          conversations.createdAt
        FROM 
          conversations
        JOIN 
          conversationusers ON conversationusers.conversationId = conversations.conversationId 
        WHERE 
          conversationusers.userId = ?
          and conversations.isGroupChat = 1
        ORDER BY 
          conversations.conversationName
      `;
    } else {
      // Default friends
      query = `
      SELECT 
        users.userId,
        users.displayName,
        users.displayId,
        users.profilePicPath,
        users.bio,
        users.isOnline,
        users.createdAt,
        friends.userId as currentUserId,
        MAX(COALESCE(m.sentAt, '1970-01-01 00:00:00')) as lastMessageTime
      FROM 
        users
      JOIN 
        friends ON friends.friendUserId = users.userId 
      LEFT JOIN 
        conversationusers cu1 ON cu1.userId = users.userId
      LEFT JOIN 
        conversationusers cu2 ON cu2.conversationId = cu1.conversationId AND cu2.userId = ?
      LEFT JOIN 
        messages m ON m.conversationId = cu1.conversationId
      WHERE 
        friends.userId = ?
      GROUP BY
        users.userId
      ORDER BY 
        lastMessageTime DESC, users.displayName
    `;
    }

    let rows;
    if (tab === "people") {
      [rows] = await connection.execute(query, [userId, userId, userId]);
    } else if (tab === "groups") {
      [rows] = await connection.execute(query, [userId]);
    } else {
      [rows] = await connection.execute(query, [userId, userId]);
    }

    await connection.end();

    const contacts = rows.map((contact) => ({
      ...contact,
    }));

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch contacts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
