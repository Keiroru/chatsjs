import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/lib/socket";
import { SocialProvider } from "@/lib/socket";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import mysql from "mysql2/promise";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chat App",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let userData = null;
  let userId;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId || "Bug";

      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "chatdb",
      });

      const [rows] = await connection.execute(
        "SELECT * FROM Users WHERE userId = ? LIMIT 1",
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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" charSet="UTF-8" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SocketProvider>
          <SocialProvider userData={userData}>
            {children}
          </SocialProvider>
        </SocketProvider>
      </body>
    </html>
  );
}