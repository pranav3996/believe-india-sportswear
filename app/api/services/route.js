import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Service from '../../../models/Service';

/**
 * GET /api/services
 * 
 * Fetch all services with optional filtering
 * 
 * Query Parameters:
 * - category: Filter by category (optional)
 * - featured: Filter featured services (optional, 'true' or 'false')
 * 
 * Response:
 * {
 *   success: true,
 *   data: [...services],
 *   count: number
 * }
 */
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');

        // Build query object
        let query = {};

        if (category && category !== 'all') {
            query.category = category.toLowerCase();
        }

        if (featured === 'true') {
            query.featured = true;
        } else if (featured === 'false') {
            query.featured = false;
        }

        // Fetch services sorted by featured status and creation date
        const services = await Service.find(query)
            .sort({ featured: -1, createdAt: -1 })
            .lean(); // Use lean() for better performance (returns plain JS objects)

        return NextResponse.json({
            success: true,
            data: services,
            count: services.length,
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch services',
                message: error.message
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/services
 * 
 * Create a new service
 * 
 * Request Body:
 * {
 *   title: string (required),
 *   description: string (required),
 *   icon?: string,
 *   image?: string,
 *   category?: string,
 *   featured?: boolean,
 *   features?: string[]
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   data: {...service},
 *   message: "Service created successfully"
 * }
 */
export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.title.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Service title is required',
                    field: 'title'
                },
                { status: 400 }
            );
        }

        if (!data.description || !data.description.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Service description is required',
                    field: 'description'
                },
                { status: 400 }
            );
        }

        // Create new service
        const service = new Service(data);
        await service.save();

        return NextResponse.json(
            {
                success: true,
                data: service,
                message: 'Service created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating service:', error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: errors
                },
                { status: 400 }
            );
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Service with this title already exists'
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create service',
                message: error.message
            },
            { status: 500 }
        );
    }
}
