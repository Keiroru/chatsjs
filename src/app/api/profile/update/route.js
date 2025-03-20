import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request) {
    let connection;

    try {
        const formData = await request.formData();

        const userId = formData.get("userId");
        const displayName = formData.get("displayName");
        const bio = formData.get("bio");
        const profilePicture = formData.get("profilePicture");


        connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASS || "",
            database: process.env.DB_NAME || "chatdb",
        });

        // Build the update fields and parameters
        const updateParams = [];
        const updateFields = [];


        updateFields.push('displayName = ?');
        updateParams.push(displayName);

        updateFields.push('bio = ?');
        updateParams.push(bio);

        updateFields.push('profilePicPath = ?');
        updateParams.push(profilePicture);


        // Build the query
        const query = `
            UPDATE Users
            SET ${updateFields.join(', ')}
            WHERE userId = ?
        `;

        // Add userId to parameters
        updateParams.push(userId);

        // Execute the update query
        const [result] = await connection.execute(query, updateParams);

        // Get the updated user data
        const [updatedRows] = await connection.execute(
            "SELECT userId, displayName, bio, profilePicPath, email FROM Users WHERE userId = ?",
            [userId]
        );

        // Close the database connection
        await connection.end();

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedRows[0]
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);

        // Make sure to close the connection if an error occurs
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error("Error closing database connection:", err);
            }
        }

        return NextResponse.json({
            success: false,
            message: "Failed to update profile. Please try again."
        }, { status: 500 });
    }
}