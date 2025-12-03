import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { signToken, sanitizeUser } from '../../../../lib/jwt';

/**
 * POST /api/auth/login
 * Custom login endpoint (alternative to NextAuth)
 * Sets httpOnly cookie with JWT token
 */
export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please provide email and password',
                },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email or password',
                },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email or password',
                },
                { status: 401 }
            );
        }

        // Create JWT token payload
        const tokenPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        // Sign JWT token
        const token = signToken(tokenPayload);

        // Sanitize user object
        const sanitized = sanitizeUser(user);

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: sanitized,
            },
            { status: 200 }
        );

        // Set httpOnly cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Login failed. Please try again.',
            },
            { status: 500 }
        );
    }
}
