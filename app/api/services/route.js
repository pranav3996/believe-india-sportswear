import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Service from '../../../models/Service';
import { requireAdmin } from '../../../lib/auth-helpers';
import {
    parseQueryParams,
    buildPaginatedResponse,
    buildQueryFilter,
    buildSortObject,
    handleApiError,
} from '../../../lib/api-helpers';

/**
 * GET /api/services
 * 
 * Fetch all services with optional filtering and pagination
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - category: Filter by category (optional)
 * - featured: Filter featured services (optional, 'true' or 'false')
 * - search: Search in title and description (optional)
 * - sortBy: Field to sort by (default: createdAt)
 * - order: Sort order 'asc' or 'desc' (default: desc)
 * 
 * Response:
 * {
 *   success: true,
 *   data: [...services],
 *   pagination: {
 *     total, count, page, limit, totalPages, hasNext, hasPrev
 *   }
 * }
 */
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const params = parseQueryParams(searchParams);

        // Build query filter
        const filter = buildQueryFilter(params);

        // Build sort object
        const sort = buildSortObject(params.sortBy, params.order);

        // Check if pagination is requested (backward compatibility)
        const isPaginated = searchParams.has('page');

        if (isPaginated) {
            // Fetch paginated services
            const [services, total] = await Promise.all([
                Service.find(filter)
                    .sort(sort)
                    .skip(params.skip)
                    .limit(params.limit)
                    .lean(),
                Service.countDocuments(filter),
            ]);

            return NextResponse.json(
                buildPaginatedResponse(services, total, params.page, params.limit)
            );
        } else {
            // Legacy: fetch all services without pagination
            const services = await Service.find(filter)
                .sort(sort)
                .lean();

            return NextResponse.json({
                success: true,
                data: services,
                count: services.length,
            });
        }
    } catch (error) {
        const errorResponse = handleApiError(error, 'Failed to fetch services');
        return NextResponse.json(
            { success: errorResponse.success, error: errorResponse.error },
            { status: errorResponse.status }
        );
    }
}

/**
 * POST /api/services
 * 
 * Create a new service (Admin only)
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
        // Check authentication
        const { session, error } = await requireAdmin();
        if (error) {
            return NextResponse.json(
                { success: error.success, error: error.error },
                { status: error.status }
            );
        }

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
        const errorResponse = handleApiError(error, 'Failed to create service');
        return NextResponse.json(
            {
                success: errorResponse.success,
                error: errorResponse.error,
                details: errorResponse.details,
            },
            { status: errorResponse.status }
        );
    }
}
