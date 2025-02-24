import { NextResponse } from "next/server.js";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "igen";

export async function middleware(request) {
  const token = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token && !request.nextUrl.searchParams.has("force")) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/chat", request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/chat")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/login", "/register"],
};
