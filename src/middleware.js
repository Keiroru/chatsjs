import { NextResponse } from "next/server.js";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "igen";

export async function middleware(request) {
    console.log("Middleware invoked for:", request.nextUrl.pathname);
    const token = request.cookies.get("session")?.value;
    console.log("Token from cookie:", token);

    if (!token) {
        console.log("No token found; redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        console.log("Token verified successfully.");
        return NextResponse.next();
    } catch (err) {
        console.log("Token verification failed; redirecting to /login", err);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/chat/:path*"],
};