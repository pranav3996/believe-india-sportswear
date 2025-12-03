import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import User from '../../../../../models/User';
import { requireAdmin } from '../../../../../lib/auth-helpers';

/**
 * GET /api/admin/users/[id]
 * Get a specific user (admin only)
 */
export async function GET(request, { params }) {
    try {
        // Check admin authentication
        const { session, error } = await requireAdmin();
        if (error) {
            return NextResponse.json(error, { status: error.status });
        }

        const { id } = params;

        await connectDB();

        const user = await User.findById(id).select('-password').lean();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch user',
            },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/users/[id]
 * Update a user (admin only)
 */
export async function PATCH(request, { params }) {
    try {
        // Check admin authentication
        const { session, error } = await requireAdmin();
        if (error) {
            return NextResponse.json(error, { status: error.status });
        }

        const { id } = params;
        const updates = await request.json();

        await connectDB();

        // Validate role if being updated
        if (updates.role && updates.role !== 'admin' && updates.role !== 'user') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid role. Must be "admin" or "user"',
                },
                { status: 400 }
            );
        }

        // Don't allow password updates through this endpoint
        if (updates.password) {
            delete updates.password;
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'User updated successfully',
                user,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update user',
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user (admin only)
 */
export async function DELETE(request, { params }) {
    try {
        // Check admin authentication
        const { session, error } = await requireAdmin();
        if (error) {
            return NextResponse.json(error, { status: error.status });
        }

        const { id } = params;

        await connectDB();

        // Prevent admin from deleting themselves
        if (session.user.id === id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'You cannot delete your own account',
                },
                { status: 403 }
            );
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'User deleted successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete user',
            },
            { status: 500 }
        );
    }
}
