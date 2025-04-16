import mysql from "mysql2/promise";

//export async function getConnection() {
////        host: process.env.DB_HOST || "chatdb.cryegskk82pm.eu-north-1.rds.amazonaws.com",
//        port: process.env.DB_PORT || 6969,
 //       user: process.env.DB_USER || "Trixep11",
 //       password: process.env.DB_PASS || "Trixep11&",
 //       database: process.env.DB_NAME || "chatdb",
 //       charset: process.env.DB_CHARSET || 'utf8mb4'
 //   });
//}

export async function getConnection() {
     return await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
         password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "chatdb",
        charset: process.env.DB_CHARSET || 'utf8mb4'
    });
 }