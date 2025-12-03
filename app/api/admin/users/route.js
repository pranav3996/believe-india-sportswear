import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { requireAdmin } from '../../../../lib/auth-helpers';

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET(request) {
    try {
        // Check admin authentication
        const { session, error } = await requireAdmin();
        if (error) {
            return NextResponse.json(error, { status: error.status });
        }

        await connectDB();

        // Get pagination params from URL
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const role = searchParams.get('role'); // Filter by role

        const skip = (page - 1) * limit;

        // Build query filter
        const filter = {};
        if (role && (role === 'admin' || role === 'user')) {
            filter.role = role;
        }

        // Fetch users
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count
        const total = await User.countDocuments(filter);

        return NextResponse.json(
            {
                success: true,
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch users',
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/users
 * Create a new user (admin only)
 */
export async function POST(request) {
    try {
        // Check admin authentication
        const { session, error } = await requireAdmin();
        if (error) {
            return NextResponse.json(error, { status: error.status });
        }

        const { name, email, password, role } = await request.json();

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

        // Validate role
        if (role && role !== 'admin' && role !== 'user') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid role. Must be "admin" or "user"',
                },
                { status: 400 }
            );
        }

        await connectDB();

        const bcrypt = require('bcryptjs');

        // Check if user exists
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

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role || 'user',
        });

        // Return user without password
        const userObj = user.toObject();
        delete userObj.password;

        return NextResponse.json(
            {
                success: true,
                message: 'User created successfully',
                user: userObj,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create user',
            },
            { status: 500 }
        );
    }
}
