import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/db';
import Testimonial from '../../../models/Testimonial';
import User from '../../../models/User';

// GET - Fetch all testimonials (no approval filtering)
export async function GET(request) {
    try {
        await connectDB();

        // Get URL search params
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('email');
        const userOnly = searchParams.get('userOnly') === 'true';

        let query = {};

        // If requesting user's own testimonials
        if (userOnly && userEmail) {
            query = { email: userEmail };
        }
        // Otherwise return all testimonials (no approval filter)

        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 });

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

// POST - Add new testimonial (only verified users)
export async function POST(request) {
    try {
        await connectDB();

        // Check if user is authenticated
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { success: false, error: 'You must be logged in to submit a testimonial' },
                { status: 401 }
            );
        }

        // Check if user is verified
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { success: false, error: 'You must verify your email before submitting a testimonial' },
                { status: 403 }
            );
        }

        const data = await request.json();

        // Validate required fields
        if (!data.message || !data.message.trim()) {
            return NextResponse.json(
                { success: false, error: 'Message is required' },
                { status: 400 }
            );
        }

        // Create testimonial data
        const testimonialData = {
            name: user.name,
            email: user.email,
            message: data.message.trim(),
            rating: data.rating || 5,
            userId: user._id,
        };

        const testimonial = new Testimonial(testimonialData);
        await testimonial.save();

        return NextResponse.json({
            success: true,
            message: 'Thank you for your feedback!',
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