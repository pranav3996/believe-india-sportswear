import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/db';
import Testimonial from '../../../../models/Testimonial';
import mongoose from 'mongoose';

// DELETE - Delete a testimonial (admin only)
export async function DELETE(request, { params }) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Please login as admin.' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get testimonial ID from params
        const { id } = params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: 'Invalid testimonial ID format' },
                { status: 400 }
            );
        }

        // Find and delete the testimonial
        const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

        if (!deletedTestimonial) {
            return NextResponse.json(
                { success: false, message: 'Testimonial not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Testimonial deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to delete testimonial' },
            { status: 500 }
        );
    }
}
