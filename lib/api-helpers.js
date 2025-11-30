import mongoose from 'mongoose';

/**
 * Parse and validate query parameters for pagination
 * 
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {object} Parsed pagination parameters
 */
export function parseQueryParams(searchParams) {
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 10));
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    return {
        page,
        limit,
        skip: (page - 1) * limit,
        search,
        category,
        featured: featured === 'true' ? true : featured === 'false' ? false : null,
        sortBy,
        order,
    };
}

/**
 * Build paginated API response
 * 
 * @param {Array} data - Array of documents
 * @param {number} total - Total count of documents
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {object} Formatted response object
 */
export function buildPaginatedResponse(data, total, page, limit) {
    return {
        success: true,
        data,
        pagination: {
            total,
            count: data.length,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
    };
}

/**
 * Handle API errors with consistent formatting
 * 
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @returns {object} Formatted error response
 */
export function handleApiError(error, defaultMessage = 'An error occurred') {
    console.error('API Error:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return {
            success: false,
            error: 'Validation failed',
            details: errors,
            status: 400,
        };
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return {
            success: false,
            error: `${field} already exists`,
            field,
            status: 409,
        };
    }

    // Mongoose cast error (invalid ObjectId)
    if (error.name === 'CastError') {
        return {
            success: false,
            error: 'Invalid ID format',
            status: 400,
        };
    }

    // Default error
    return {
        success: false,
        error: error.message || defaultMessage,
        status: 500,
    };
}

/**
 * Validate MongoDB ObjectId
 * 
 * @param {string} id - ID to validate
 * @returns {boolean}
 */
export function validateObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Build MongoDB query filter from parameters
 * 
 * @param {object} params - Query parameters
 * @returns {object} MongoDB filter object
 */
export function buildQueryFilter(params) {
    const filter = {};

    // Category filter
    if (params.category) {
        filter.category = params.category;
    }

    // Featured filter
    if (params.featured !== null) {
        filter.featured = params.featured;
    }

    // Search filter (text search on title and description)
    if (params.search) {
        filter.$or = [
            { title: { $regex: params.search, $options: 'i' } },
            { description: { $regex: params.search, $options: 'i' } },
        ];
    }

    return filter;
}

/**
 * Build MongoDB sort object from parameters
 * 
 * @param {string} sortBy - Field to sort by
 * @param {number} order - Sort order (1 for asc, -1 for desc)
 * @returns {object} MongoDB sort object
 */
export function buildSortObject(sortBy, order) {
    const validSortFields = ['title', 'category', 'featured', 'createdAt', 'updatedAt'];

    if (!validSortFields.includes(sortBy)) {
        sortBy = 'createdAt';
    }

    return { [sortBy]: order };
}
