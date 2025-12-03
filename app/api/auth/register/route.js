import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { sanitizeUser } from '../../../../lib/jwt';
import { sendVerificationEmail } from '../../../../lib/email';


/**
 * POST /api/auth/register
 * Register a new user account
 */
export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please provide name, email, and password',
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please provide a valid email address',
                },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Password must be at least 6 characters',
                },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User with this email already exists',
                },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (default role is 'user' from schema)
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            isVerified: false, // Explicitly set to false
        });

        // Generate verification token (5 minutes expiry)
        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        try {
            await sendVerificationEmail(user.email, user.name, verificationUrl);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Continue despite email failure - user can request resend
        }

        // Return sanitized user object
        const sanitized = sanitizeUser(user);

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful! Please check your email to verify your account. The link expires in 5 minutes.',
                user: sanitized,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                {
                    success: false,
                    error: messages.join(', '),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Registration failed. Please try again.',
            },
            { status: 500 }
        );
    }
}
