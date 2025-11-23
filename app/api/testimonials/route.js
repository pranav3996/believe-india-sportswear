import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/db';
import Testimonial from '../../../models/Testimonial';

// GET - Fetch all approved testimonials (public)
export async function GET(request) {
    try {
        await connectDB();

        const testimonials = await Testimonial.find({ approved: true })
            .sort({ featured: -1, createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: testimonials,
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch testimonials' },
            { status: 500 }
        );
    }
}

// POST - Add new testimonial (protected)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const data = await request.json();

        const testimonial = new Testimonial(data);
        await testimonial.save();

        return NextResponse.json({
            success: true,
            data: testimonial,
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create testimonial' },
            { status: 500 }
        );
    }
}
