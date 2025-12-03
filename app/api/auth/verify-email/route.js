import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import connectDB from '../../../../lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/verify-email?token=xxx
 * Verify user's email address
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Verification token is required',
                },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user with this verification token
        const user = await User.findOne({
            verificationToken: token,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid verification token',
                },
                { status: 400 }
            );
        }

        // Check if token has expired
        if (user.verificationTokenExpiry < new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Verification token has expired. Please request a new verification email.',
                    expired: true,
                },
                { status: 400 }
            );
        }

        // Token is valid - verify the user
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Email verified successfully! You can now log in to your account.',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Verification failed. Please try again.',
            },
            { status: 500 }
        );
    }
}
