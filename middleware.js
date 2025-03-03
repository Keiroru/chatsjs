import { NextResponse } from "next/server.js";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "igen";

export async function middleware(request) {
    const token = request.cookies.get("session")?.value;

    if (request.nextUrl.pathname.startsWith("/chat")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const decoded = await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL("/chat", request.url));
        } catch (err) {
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/chat/:path*", "/login", "/register"],
};
