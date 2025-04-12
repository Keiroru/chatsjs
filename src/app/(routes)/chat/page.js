import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import ChatClient from "../../components/chatClient";
import { getConnection } from "@/lib/db";

export default async function Chat() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let userData = null;
  let userId;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId || "Bug";

      const connection = await getConnection();

      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE userId = ? LIMIT 1",
        [userId]
      );
      if (rows.length > 0) {
        userData = rows[0];
      }
      await connection.end();
    } catch (err) {
      console.error("JWT verification or DB query failed", err);
    }
  }
  return (
    <ChatClient userData={userData} />
  );
}
