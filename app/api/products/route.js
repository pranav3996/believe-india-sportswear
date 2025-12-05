import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/db';
import Product from '../../../models/Product';
import Category from '../../../models/Category';
import { logAuditAction } from '../../../lib/auditLog';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions';

// GET - Fetch products with filtering, search, and pagination
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');
        const search = searchParams.get('search');
        const status = searchParams.get('status');
        const featured = searchParams.get('featured');
        const inStock = searchParams.get('inStock');

        let query = {};

        // Category filter
        if (category && category !== 'all') {
            query.category = category;
        }

        // Subcategory filter
        if (subcategory) {
            query.subcategory = subcategory;
        }

        // Status filter (for admin)
        if (status) {
            query.status = status;
        } else {
            // Public queries only show published products
            const session = await getServerSession(authOptions);
            if (!session || session.user.role === 'user') {
                query.status = 'published';
            }
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // In stock filter
        if (inStock === 'true') {
            query.inStock = true;
        }

        // Search filter (text search)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const total = await Product.countDocuments(query);

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug')
            .sort({ featured: -1, createdAt: -1 })
            .limit(limit)
            .skip(skip);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST - Create new product (protected)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check permission
        if (!hasPermission(session.user, PERMISSIONS.PRODUCTS_CREATE)) {
            return NextResponse.json(
                { success: false, error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        await connectDB();

        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.description || !data.category) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate category exists
        const category = await Category.findById(data.category);
        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Invalid category' },
                { status: 400 }
            );
        }

        // Validate subcategory if provided
        if (data.subcategory) {
            const subcategory = await Category.findById(data.subcategory);
            if (!subcategory || subcategory.parent?.toString() !== data.category) {
                return NextResponse.json(
                    { success: false, error: 'Invalid subcategory' },
                    { status: 400 }
                );
            }
        }

        const product = new Product(data);
        await product.save();

        // Log the action
        await logAuditAction({
            action: 'CREATE',
            resourceType: 'Product',
            resourceId: product._id.toString(),
            resourceName: product.name,
            changes: {
                after: {
                    name: product.name,
                    category: category.name,
                    variants: product.variants.length,
                    status: product.status,
                },
            },
            description: `Created product "${product.name}" with ${product.variants.length} variants`,
            req: request,
        });

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
