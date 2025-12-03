import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Clear authentication cookie and logout user
 */
export async function POST(request) {
    try {
        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'Logged out successfully',
            },
            { status: 200 }
        );

        // Clear auth-token cookie
        response.cookies.set('auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Logout failed. Please try again.',
            },
            { status: 500 }
        );
    }
}
