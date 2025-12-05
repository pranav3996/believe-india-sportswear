import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect admin, user, and password management routes
 * - Only users with role 'admin' can access /admin/*
 * - Only users with role 'user' can access /user/*
 * - Only authenticated users can access /change-password
 * - Unauthenticated users are redirected to /login
 */
export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        // Allow access to public auth pages
        if (pathname === '/login' ||
            pathname.startsWith('/verify-email') ||
            pathname.startsWith('/forgot-password') ||
            pathname.startsWith('/reset-password')) {
            return NextResponse.next();
        }

        // Protect change-password route (requires authentication)
        if (pathname.startsWith('/change-password')) {
            if (!token) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
            return NextResponse.next();
        }

        // Protect admin routes
        if (pathname.startsWith('/admin')) {
            if (!token) {
                // Not authenticated at all - redirect to login
                return NextResponse.redirect(new URL('/login', req.url));
            }
            if (token?.role !== 'admin') {
                // Authenticated but wrong role - redirect user to their dashboard
                return NextResponse.redirect(new URL('/user/dashboard', req.url));
            }
            return NextResponse.next();
        }

        // Protect user routes
        if (pathname.startsWith('/user')) {
            if (!token) {
                // Not authenticated at all - redirect to login
                return NextResponse.redirect(new URL('/login', req.url));
            }
            if (token?.role !== 'user') {
                // Authenticated but wrong role - redirect admin to their dashboard
                return NextResponse.redirect(new URL('/admin', req.url));
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

                // Allow public auth pages without token
                if (pathname === '/login' ||
                    pathname.startsWith('/verify-email') ||
                    pathname.startsWith('/forgot-password') ||
                    pathname.startsWith('/reset-password')) {
                    return true;
                }

                // Protected routes require a token
                if (pathname.startsWith('/admin') ||
                    pathname.startsWith('/user') ||
                    pathname.startsWith('/change-password')) {
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
        '/change-password',
        '/forgot-password',
        '/reset-password',
    ],
};
