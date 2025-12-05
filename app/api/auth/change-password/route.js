import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { authOptions } from '../[...nextauth]/route';
import { sendPasswordResetSuccessEmail } from '../../../../lib/email';

/**
 * Change password for authenticated users
 * POST /api/auth/change-password
 * 
 * Security:
 * - User must be authenticated (NextAuth session)
 * - User must be verified
 * - Old password must be validated
 * - New password must be hashed before saving
 */
export async function POST(req) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        // Get request body
        const { oldPassword, newPassword } = await req.json();

        // Validate inputs
        if (!oldPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Please provide both old and new passwords.' },
                { status: 400 }
            );
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'New password must be at least 6 characters long.' },
                { status: 400 }
            );
        }

        // Ensure old and new passwords are different
        if (oldPassword === newPassword) {
            return NextResponse.json(
                { error: 'New password must be different from old password.' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Get user from database
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        // Check if user is verified
        if (!user.isVerified) {
            return NextResponse.json(
                { error: 'Please verify your email before changing password.' },
                { status: 403 }
            );
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordValid) {
            return NextResponse.json(
                { error: 'Old password is incorrect.' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password in database
        user.password = hashedPassword;
        await user.save();

        // Send confirmation email (optional - don't fail if email fails)
        try {
            await sendPasswordResetSuccessEmail(user.email, user.name);
        } catch (emailError) {
            console.error('Failed to send password change confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Password updated successfully.'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while changing password. Please try again.' },
            { status: 500 }
        );
    }
}
