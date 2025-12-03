import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { sendVerificationEmail } from '../../../../lib/email';

/**
 * POST /api/auth/resend-verification
 * Resend verification email for unverified users
 */
export async function POST(request) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.trim()) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No user found with this email' },
                { status: 404 }
            );
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json(
                { success: false, error: 'Email is already verified. You can log in now.' },
                { status: 400 }
            );
        }

        // Generate new verification token (5 minutes expiry)
        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Send new verification email
        const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        try {
            await sendVerificationEmail(user.email, user.name, verificationUrl);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            return NextResponse.json(
                { success: false, error: 'Failed to send verification email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'A new verification email has been sent. Please check your inbox. The link expires in 5 minutes.',
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to resend verification email. Please try again.' },
            { status: 500 }
        );
    }
}
