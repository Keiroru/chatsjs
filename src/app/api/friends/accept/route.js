import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const requestId = Number(body.requestId);

    console.log("Received request body:", body);
    console.log("Request ID being used:", requestId);
    console.log("Request ID type:", typeof requestId);


    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "chatdb",
    });

    await connection.beginTransaction();

    try {
      const [requests] = await connection.execute(
        `SELECT 
          fr.requestId, 
          fr.senderUserId, 
          fr.receiverUserId,
          
          -- Sender info
          sender.userId AS senderUserId, 
          sender.displayName AS senderDisplayName, 
          sender.displayId AS senderDisplayId,
          sender.createdAt AS senderCreatedAt, 
          sender.isOnline AS senderIsOnline, 
          sender.bio AS senderBio, 
          sender.profilePicPath AS senderProfilePicPath,
          
          -- Receiver info
          receiver.userId AS receiverUserId, 
          receiver.displayName AS receiverDisplayName,
          receiver.displayId AS receiverDisplayId,
          receiver.createdAt AS receiverCreatedAt, 
          receiver.isOnline AS receiverIsOnline, 
          receiver.bio AS receiverBio, 
          receiver.profilePicPath AS receiverProfilePicPath
         FROM 
          FriendRequest fr
         JOIN 
          Users sender ON fr.senderUserId = sender.userId
         JOIN 
          Users receiver ON fr.receiverUserId = receiver.userId
         WHERE 
          fr.requestId = ?`,
        [requestId]
      );

      console.log("SQL result:", requests);

      const senderInfo = {
        userId: requests[0].senderUserId,
        displayName: requests[0].senderDisplayName,
        displayId: requests[0].senderDisplayId,
        profilePicPath: requests[0].senderProfilePicPath,
        isOnline: requests[0].senderIsOnline,
        bio: requests[0].senderBio,
        createdAt: requests[0].senderCreatedAt
      };

      const receiverInfo = {
        userId: requests[0].receiverUserId,
        displayName: requests[0].receiverDisplayName,
        displayId: requests[0].receiverDisplayId,
        profilePicPath: requests[0].receiverProfilePicPath,
        isOnline: requests[0].receiverIsOnline,
        bio: requests[0].receiverBio,
        createdAt: requests[0].receiverCreatedAt
      };

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
          succes: true,
          sender: senderInfo,
          receiver: receiverInfo,
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
