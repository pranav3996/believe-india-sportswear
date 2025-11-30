import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect admin routes
 * Only users with role 'admin' can access /admin/* routes (except login)
 */
export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        // Allow access to login page
        if (pathname.startsWith('/admin/login')) {
            return NextResponse.next();
        }

        // Check if user is admin
        if (token?.role !== 'admin') {
            // Redirect non-admin users to login
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        // Allow admin users to proceed
        return NextResponse.next();
    },
    {
        callbacks: {
            // Only run middleware if there's a token or if accessing admin routes
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow login page without token
                if (pathname.startsWith('/admin/login')) {
                    return true;
                }

                // All other admin routes require a token
                return !!token;
            },
        },
    }
);

// Specify which routes this middleware applies to
export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
