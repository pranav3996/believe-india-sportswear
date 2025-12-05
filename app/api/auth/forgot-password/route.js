import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { sendPasswordResetEmail } from '../../../../lib/email';

/**
 * Initiate password reset process
 * POST /api/auth/forgot-password
 * 
 * Security:
 * - Always returns success message (prevents email enumeration)
 * - Only sends email if user exists AND is verified
 * - Generates secure token with 10-minute expiry
 */
export async function POST(req) {
    try {
        // Get request body
        const { email } = await req.json();

        // Validate email
        if (!email || !email.trim()) {
            return NextResponse.json(
                { error: 'Please provide an email address.' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // SECURITY: Always return success message to prevent email enumeration
        // Only actually send email if user exists and is verified
        if (user && user.isVerified) {
            // Generate reset token
            const resetToken = user.generateResetToken();

            // Save user with token
            await user.save();

            // Create reset URL
            const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

            // Send password reset email
            try {
                await sendPasswordResetEmail(user.email, user.name, resetUrl);
            } catch (emailError) {
                console.error('Failed to send password reset email:', emailError);
                // Continue anyway - don't reveal that email sending failed
            }
        } else {
            // User doesn't exist or is not verified
            // We still return success to prevent email enumeration
            console.log(`Password reset requested for non-existent or unverified email: ${email}`);
        }

        // Always return the same success message for security
        return NextResponse.json(
            {
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link shortly.'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Forgot password error:', error);
        // Even on error, return generic message for security
        return NextResponse.json(
            {
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link shortly.'
            },
            { status: 200 }
        );
    }
}
