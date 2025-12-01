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

// POST - Add new testimonial (public submissions allowed)
export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();

        // Check for honeypot field (spam protection)
        if (data.website || data.url) {
            // Silent rejection - bots typically fill these fields
            return NextResponse.json({
                success: true,
                message: 'Thank you for your feedback — once approved, it will appear here.',
            });
        }

        // Validate required fields (support both old and new field names)
        const name = data.name || data.customerName;
        const message = data.message || data.text;

        if (!name || !name.trim()) {
            return NextResponse.json(
                { success: false, error: 'Name is required' },
                { status: 400 }
            );
        }

        if (!message || !message.trim()) {
            return NextResponse.json(
                { success: false, error: 'Message is required' },
                { status: 400 }
            );
        }

        // Sanitize and prepare data
        const testimonialData = {
            name: name.trim(),
            message: message.trim(),
            email: data.email ? data.email.trim() : undefined,
            rating: data.rating || 5,
            avatarUrl: data.avatarUrl ? data.avatarUrl.trim() : undefined,
            company: data.company ? data.company.trim() : undefined,
            approved: false, // Requires admin approval for public submissions
        };

        // Check if this is an authenticated admin submission
        const session = await getServerSession(authOptions);
        if (session) {
            // Admin users can submit pre-approved testimonials
            testimonialData.approved = data.approved !== undefined ? data.approved : true;
            testimonialData.featured = data.featured || false;
        }

        const testimonial = new Testimonial(testimonialData);
        await testimonial.save();

        return NextResponse.json({
            success: true,
            message: 'Thank you for your feedback — once approved, it will appear here.',
            data: session ? testimonial : undefined, // Only return data to admins
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create testimonial' },
            { status: 500 }
        );
    }
}
