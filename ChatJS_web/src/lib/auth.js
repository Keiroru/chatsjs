import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "igen";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function createToken(payload, expiresIn = "7d") {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secretKey);

    return token;
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        return null;
    }
}