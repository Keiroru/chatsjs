import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import mysql from "mysql2/promise";
import ChatClient from "./chatClient";

export default async function Chat() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let userData = null;
  let userName = "Guest";

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      userName = payload.username || userName;

      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "chatdb",
      });

      const [rows] = await connection.execute(
        "SELECT * FROM Users WHERE userName = ? LIMIT 1",
        [userName]
      );
      if (rows.length > 0) {
        userData = rows[0];
      }
      await connection.end();
    } catch (err) {
      console.error("JWT verification or DB query failed", err);
    }
  }
  return <ChatClient userData={userData} />;
}
