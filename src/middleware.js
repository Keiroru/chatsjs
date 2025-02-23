import { NextResponse } from "next/server.js";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "igen";

export async function middleware(request) {
    const token = request.cookies.get("session")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/chat/:path*"],
};