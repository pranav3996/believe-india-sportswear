import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect admin and user routes
 * - Only users with role 'admin' can access /admin/*
 * - Only users with role 'user' can access /user/*
 * - Unauthenticated users are redirected to /login
 */
export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        // Allow access to login page
        if (pathname === '/login' || pathname.startsWith('/verify-email')) {
            return NextResponse.next();
        }

        // Protect admin routes
        if (pathname.startsWith('/admin')) {
            if (token?.role !== 'admin') {
                // Redirect non-admin users to login
                return NextResponse.redirect(new URL('/login', req.url));
            }
            return NextResponse.next();
        }

        // Protect user routes
        if (pathname.startsWith('/user')) {
            if (token?.role !== 'user') {
                // Redirect non-user users to login
                return NextResponse.redirect(new URL('/login', req.url));
            }
            return NextResponse.next();
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Only run middleware if there's a token or if accessing protected routes
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow login pages without token
                if (pathname === '/login' || pathname.startsWith('/verify-email')) {
                    return true;
                }

                // Protected routes require a token
                if (pathname.startsWith('/admin') || pathname.startsWith('/user')) {
                    return !!token;
                }

                // Allow other routes
                return true;
            },
        },
    }
);

// Specify which routes this middleware applies to
export const config = {
    matcher: [
        '/admin/:path*',
        '/user/:path*',
        '/login',
    ],
};
