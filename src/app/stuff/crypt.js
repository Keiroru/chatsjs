import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "igen";

export async function encrypt(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: payload.expiresIn });
}