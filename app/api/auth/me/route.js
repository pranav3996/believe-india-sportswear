import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { verifyToken, extractTokenFromCookie, sanitizeUser } from '../../../../lib/jwt';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/me
 * Get current authenticated user from JWT token
 */
export async function GET(request) {
    try {
        // Extract token from cookie
        const cookieHeader = request.headers.get('cookie');
        const token = extractTokenFromCookie(cookieHeader, 'auth-token');

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Not authenticated',
                },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid or expired token',
                },
                { status: 401 }
            );
        }

        await connectDB();

        // Fetch fresh user data from database
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            );
        }

        // Sanitize user object
        const sanitized = sanitizeUser(user);

        return NextResponse.json(
            {
                success: true,
                user: sanitized,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get user information',
            },
            { status: 500 }
        );
    }
}
