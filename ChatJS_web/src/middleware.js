import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode("igen");

export default async function middleware(req) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get('session')?.value ||
        req.cookies.get('authToken')?.value ||
        req.headers.get('authorization')?.split(' ')[1];

    if (pathname.startsWith('/chat')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    if (pathname === '/login' || pathname === '/register') {
        if (token) {
            try {
                await jwtVerify(token, JWT_SECRET);
                return NextResponse.redirect(new URL('/chat', req.url));
            } catch (error) {
                console.error('Token verification failed for login/register:', error);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/chat', '/chat/:path*', '/login', '/register']
};