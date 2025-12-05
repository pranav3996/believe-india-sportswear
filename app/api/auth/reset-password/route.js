import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { sendPasswordResetSuccessEmail } from '../../../../lib/email';

/**
 * Reset password using token from email
 * POST /api/auth/reset-password
 * 
 * Security:
 * - Validates token exists and hasn't expired
 * - Hashes new password before saving
 * - Clears reset token after successful reset
 */
export async function POST(req) {
    try {
        // Get request body
        const { token, newPassword } = await req.json();

        // Validate inputs
        if (!token || !token.trim()) {
            return NextResponse.json(
                { error: 'Reset token is required.' },
                { status: 400 }
            );
        }

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long.' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find user by reset token
        const user = await User.findOne({
            resetToken: token.trim()
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid reset token. Please request a new password reset.' },
                { status: 400 }
            );
        }

        // Check if token has expired
        if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
            // Clear expired token
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            return NextResponse.json(
                { error: 'Reset link has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        // Send confirmation email (optional - don't fail if email fails)
        try {
            await sendPasswordResetSuccessEmail(user.email, user.name);
        } catch (emailError) {
            console.error('Failed to send password reset confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Password reset successfully.'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while resetting password. Please try again.' },
            { status: 500 }
        );
    }
}
