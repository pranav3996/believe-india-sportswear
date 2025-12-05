import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/db';
import Category from '../../../models/Category';
import { logAuditAction } from '../../../lib/auditLog';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions';

// GET - Fetch all categories (hierarchical)
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get('parent');
        const includeInactive = searchParams.get('includeInactive') === 'true';

        let query = {};

        // Filter by parent (null for main categories)
        if (parentId === 'null' || parentId === '') {
            query.parent = null;
        } else if (parentId) {
            query.parent = parentId;
        }

        // Filter by active status
        if (!includeInactive) {
            query.isActive = true;
        }

        const categories = await Category.find(query)
            .populate('parent', 'name slug')
            .sort({ order: 1, name: 1 });

        // If no parent filter, build hierarchical structure
        if (!parentId) {
            const mainCategories = categories.filter(cat => !cat.parent);
            const result = await Promise.all(mainCategories.map(async (cat) => {
                const subcategories = await Category.find({ parent: cat._id, isActive: true })
                    .sort({ order: 1, name: 1 });
                return {
                    ...cat.toObject(),
                    subcategories,
                };
            }));

            return NextResponse.json({
                success: true,
                data: result,
            });
        }

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST - Create new category (protected)
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
        if (!hasPermission(session.user, PERMISSIONS.CATEGORIES_MANAGE)) {
            return NextResponse.json(
                { success: false, error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        await connectDB();

        const data = await request.json();

        // Validate required fields
        if (!data.name) {
            return NextResponse.json(
                { success: false, error: 'Category name is required' },
                { status: 400 }
            );
        }

        // If parent is provided, validate it exists
        if (data.parent) {
            const parentCategory = await Category.findById(data.parent);
            if (!parentCategory) {
                return NextResponse.json(
                    { success: false, error: 'Invalid parent category' },
                    { status: 400 }
                );
            }
            // Prevent nested subcategories (only 2 levels)
            if (parentCategory.parent) {
                return NextResponse.json(
                    { success: false, error: 'Cannot create subcategory of a subcategory' },
                    { status: 400 }
                );
            }
        }

        const category = new Category(data);
        await category.save();

        // Log the action
        await logAuditAction({
            action: 'CREATE',
            resourceType: 'Category',
            resourceId: category._id.toString(),
            resourceName: category.name,
            changes: {
                after: {
                    name: category.name,
                    parent: category.parent || 'Main Category',
                    isActive: category.isActive,
                },
            },
            description: `Created category "${category.name}"`,
            req: request,
        });

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);

        // Handle duplicate name error
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Category with this name already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create category' },
            { status: 500 }
        );
    }
}
