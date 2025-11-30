import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Service from '../../../../models/Service';
import mongoose from 'mongoose';

/**
 * GET /api/services/[id]
 * 
 * Fetch a single service by ID
 * 
 * Response:
 * {
 *   success: true,
 *   data: {...service}
 * }
 */
export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid service ID format'
                },
                { status: 400 }
            );
        }

        const service = await Service.findById(id);

        if (!service) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Service not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: service,
        });
    } catch (error) {
        console.error('Error fetching service:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch service',
                message: error.message
            },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/services/[id]
 * 
 * Update an existing service
 * 
 * Request Body (all fields optional, but at least one required):
 * {
 *   title?: string,
 *   description?: string,
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
 *   data: {...updatedService},
 *   message: "Service updated successfully"
 * }
 */
export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid service ID format'
                },
                { status: 400 }
            );
        }

        const data = await request.json();

        // Check if at least one field is provided
        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No update data provided'
                },
                { status: 400 }
            );
        }

        // Validate title if provided
        if (data.title !== undefined && (!data.title || !data.title.trim())) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Title cannot be empty',
                    field: 'title'
                },
                { status: 400 }
            );
        }

        // Validate description if provided
        if (data.description !== undefined && (!data.description || !data.description.trim())) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Description cannot be empty',
                    field: 'description'
                },
                { status: 400 }
            );
        }

        // Update service (runValidators ensures schema validation on update)
        const service = await Service.findByIdAndUpdate(
            id,
            data,
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );

        if (!service) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Service not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: service,
            message: 'Service updated successfully',
        });
    } catch (error) {
        console.error('Error updating service:', error);

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

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update service',
                message: error.message
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/services/[id]
 * 
 * Delete a service
 * 
 * Response:
 * {
 *   success: true,
 *   message: "Service deleted successfully",
 *   data: {...deletedService}
 * }
 */
export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid service ID format'
                },
                { status: 400 }
            );
        }

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Service not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Service deleted successfully',
            data: service,
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete service',
                message: error.message
            },
            { status: 500 }
        );
    }
}
