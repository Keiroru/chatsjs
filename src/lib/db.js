import mysql from "mysql2/promise";

export async function getConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "chatdb",
        charset: process.env.DB_CHARSET || 'utf8mb4'
    });
}