import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      desc,
      senderId,
      attachmentType,
      attachmentName,
      attachmentPath,
      attachmentSize,
    } = body;

    const connection = await getConnection();

    const decodedTitle = decodeURIComponent(title);
    const decodedDesc = decodeURIComponent(desc);

    let attachmentId = null;

    if (attachmentType) {
      const [attachmentResult] = await connection.execute(
        `INSERT INTO attachment (fileType, fileName, filePath, fileSize) VALUES (?, ?, ?, ?)`,
        [attachmentType, attachmentName, attachmentPath, attachmentSize]
      );
      attachmentId = attachmentResult.insertId;
    }

    const query = `
        INSERT INTO bugreports(senderUserId, header, description, attachmentId)
        VALUES(?,?,?,?)
        `;

    await connection.execute(query, [
      senderId,
      decodedTitle,
      decodedDesc,
      attachmentId,
    ]);
    await connection.end();
    return NextResponse.json(
      {
        succes: true,
        message: "Report Sent Succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send Bug report",
      },
      { status: 500 }
    );
  }
}
