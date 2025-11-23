import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Contact from '../../../models/Contact';
import { sendContactEmail, isValidEmail, isValidPhone } from '../../../lib/email';

// POST - Submit contact form (public)
export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();

        // Honeypot spam protection
        if (data.website) {
            // If honeypot field is filled, it's likely a bot
            return NextResponse.json(
                { success: false, error: 'Invalid submission' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            return NextResponse.json(
                { success: false, error: 'All required fields must be filled' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!isValidEmail(data.email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate phone number if provided
        if (!isValidPhone(data.phone)) {
            return NextResponse.json(
                { success: false, error: 'Phone number must be exactly 10 digits' },
                { status: 400 }
            );
        }

        // Save to database
        const contactData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
        };

        const contact = new Contact(contactData);
        await contact.save();

        // Send email to production team
        const emailResult = await sendContactEmail(contactData);

        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
            // Still return success since data was saved to DB
            return NextResponse.json({
                success: true,
                message: 'Message saved successfully, but email notification failed',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}

// GET - Fetch all contact submissions (protected - for admin panel)
export async function GET(request) {
    try {
        const { getServerSession } = await import('next-auth');
        const { authOptions } = await import('../auth/[...nextauth]/route');
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const contacts = await Contact.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}
