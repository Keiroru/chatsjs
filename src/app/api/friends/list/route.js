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
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    let query = "";
    if (tab === "people") {
      query = `
        SELECT 
          Users.userId,
          Users.displayName,
          Users.displayId,
          Users.profilePicPath,
          Users.bio,
          Users.isOnline,
          Users.createdAt
        FROM 
          Users
        WHERE 
          Users.isLookingForFriends = 1
          AND Users.userId != ?  -- Exclude the current user
          AND NOT EXISTS (
            SELECT 1 FROM Friends 
            WHERE (Friends.userId = ? AND Friends.friendUserId = Users.userId)
            OR (Friends.userId = Users.userId AND Friends.friendUserId = ?)
          )
        ORDER BY 
          Users.displayName
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
        Users.userId,
        Users.displayName,
        Users.displayId,
        Users.profilePicPath,
        Users.bio,
        Users.isOnline,
        Users.createdAt,
        Friends.userId as currentUserId,
        MAX(COALESCE(m.sentAt, '1970-01-01 00:00:00')) as lastMessageTime
      FROM 
        Users
      JOIN 
        Friends ON Friends.friendUserId = Users.userId 
      LEFT JOIN 
        ConversationUsers cu1 ON cu1.userId = Users.userId
      LEFT JOIN 
        ConversationUsers cu2 ON cu2.conversationId = cu1.conversationId AND cu2.userId = ?
      LEFT JOIN 
        Messages m ON m.conversationId = cu1.conversationId
      WHERE 
        Friends.userId = ?
      GROUP BY
        Users.userId
      ORDER BY 
        lastMessageTime DESC, Users.displayName
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
