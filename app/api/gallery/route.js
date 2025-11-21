import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/db';
import Gallery from '../../../models/Gallery';

// GET: Fetch all gallery images
export async function GET() {
    try {
        await connectDB();

        const images = await Gallery.find().sort({ timestamp: -1 });

        return NextResponse.json({ success: true, data: images });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch gallery images' },
            { status: 500 }
        );
    }
}

// POST: Add new image (protected)
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

        const body = await request.json();

        const newImage = await Gallery.create(body);

        return NextResponse.json({ success: true, data: newImage }, { status: 201 });
    } catch (error) {
        console.error('Error adding image:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add image' },
            { status: 500 }
        );
    }
}
