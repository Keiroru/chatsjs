import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const requestId = Number(body.requestId);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    await connection.beginTransaction();

    try {
      const [requests] = await connection.execute(
        `SELECT FriendRequest.senderUserId, FriendRequest.receiverUserId, FriendRequest.requestId,
                Users.userId, Users.displayName, Users.createdAt, Users.isOnline, Users.bio
         FROM FriendRequest
         JOIN Users ON FriendRequest.senderUserId = Users.userId
         WHERE requestId = ?`,
        [requestId]
      );

      if (requests.length === 0) {
        await connection.rollback();
        await connection.end();
        return NextResponse.json(
          { error: "Friend request not found" },
          { status: 404 }
        );
      }

      const { senderUserId, receiverUserId } = requests[0];

      const [sender] = await connection.execute(
        `SELECT displayName FROM Users WHERE userId = ?`,
        [senderUserId]
      );
      const [receiver] = await connection.execute(
        `SELECT displayName FROM Users WHERE userId = ?`,
        [receiverUserId]
      );


      const senderName = sender[0].displayName;
      const receiverName = receiver[0].displayName;
      const conversationName = `${senderName} and ${receiverName}`;

      await connection.execute(`INSERT INTO conversations (conversationName) VALUES (?)`, [conversationName]);

      await connection.execute('INSERT INTO conversationusers (userId, conversationId) VALUES (?, (SELECT conversationId FROM conversations WHERE conversationName = ?))', [senderUserId, conversationName]);
      await connection.execute('INSERT INTO conversationusers (userId, conversationId) VALUES (?, (SELECT conversationId FROM conversations WHERE conversationName = ?))', [receiverUserId, conversationName]);

      await connection.execute(
        `UPDATE FriendRequest SET status = 'accepted' WHERE requestId = ?`,
        [requestId]
      );

      await connection.execute(
        `INSERT INTO Friends (userId, friendUserId) VALUES (?, ?)`,
        [receiverUserId, senderUserId]
      );

      await connection.execute(
        `INSERT INTO Friends (userId, friendUserId) VALUES (?, ?)`,
        [senderUserId, receiverUserId]
      );

      await connection.commit();
      await connection.end();

      return NextResponse.json(
        {
          requests,
        },
        { status: 200 }
      );
    } catch (transactionError) {
      await connection.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error processing friend request:", error);
    return NextResponse.json(
      {
        error: "Failed to process friend request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
