import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const requestId = Number(body.requestId);

    // Validate input
    if (isNaN(requestId) || requestId <= 0) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });


    await connection.beginTransaction();

    try {
      const [requests] = await connection.execute(
        `SELECT senderUserId, receiverUserId FROM FriendRequests WHERE requestId = ?`,
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

      await connection.execute(
        `UPDATE FriendRequests SET status = 'accepted' WHERE requestId = ?`,
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
          message: "Friend request accepted and friendship established",
          senderUserId,
          receiverUserId
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