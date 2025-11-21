import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../lib/db';
import { authOptions } from '../auth/[...nextauth]/route';
import About from '../../../models/About';

// GET: Fetch company information
export async function GET() {
    try {
        await connectDB();

        let about = await About.findOne();

        // If no document exists, create one with default values
        if (!about) {
            about = await About.create({});
        }

        return NextResponse.json({ success: true, data: about });
    } catch (error) {
        console.error('Error fetching about data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch company information' },
            { status: 500 }
        );
    }
}

// POST: Update company information (protected)
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

        let about = await About.findOne();

        if (about) {
            // Update existing document
            about = await About.findByIdAndUpdate(
                about._id,
                { ...body, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
        } else {
            // Create new document
            about = await About.create(body);
        }

        return NextResponse.json({ success: true, data: about });
    } catch (error) {
        console.error('Error updating about data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update company information' },
            { status: 500 }
        );
    }
}
