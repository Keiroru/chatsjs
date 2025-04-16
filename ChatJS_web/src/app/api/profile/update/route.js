import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  let connection;

  try {
    const formData = await request.formData();

    const userId = formData.get("userId");
    const displayName = formData.get("displayName");
    const bio = formData.get("bio");
    const profilePicture = formData.get("profilePicture");

    const connection = await getConnection();

    const updateParams = [];
    const updateFields = [];

    updateFields.push("displayName = ?");
    updateParams.push(displayName);

    updateFields.push("bio = ?");
    updateParams.push(bio);

    updateFields.push("profilePicPath = ?");
    updateParams.push(profilePicture);

    const query = `
            UPDATE users
            SET ${updateFields.join(", ")}
            WHERE userId = ?
        `;

    updateParams.push(userId);
    const [result] = await connection.execute(query, updateParams);

    const [updatedRows] = await connection.execute(
      "SELECT userId, displayName, bio, profilePicPath, email FROM users WHERE userId = ?",
      [userId]
    );
    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: updatedRows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);

    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile. Please try again.",
      },
      { status: 500 }
    );
  }
}
