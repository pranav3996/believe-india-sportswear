import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/db';
import Category from '../../../../models/Category';
import Product from '../../../../models/Product';
import { logAuditAction } from '../../../../lib/auditLog';
import { hasPermission, PERMISSIONS } from '../../../../lib/permissions';

// GET - Get single category by ID
export async function GET(request, { params }) {
    try {
        await connectDB();

        const category = await Category.findById(params.id)
            .populate('parent', 'name slug');

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        // Get subcategories
        const subcategories = await Category.find({ parent: category._id })
            .sort({ order: 1, name: 1 });

        // Get product count
        const productCount = await Product.countDocuments({
            category: category._id,
            status: 'published'
        });

        return NextResponse.json({
            success: true,
            data: {
                ...category.toObject(),
                subcategories,
                productCount,
            },
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

// PUT - Update category (protected)
export async function PUT(request, { params }) {
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

        const category = await Category.findById(params.id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        const data = await request.json();

        // Store old values for audit log
        const oldValues = {
            name: category.name,
            isActive: category.isActive,
        };

        // Update category
        Object.assign(category, data);
        await category.save();

        // Log the action
        await logAuditAction({
            action: 'UPDATE',
            resourceType: 'Category',
            resourceId: category._id.toString(),
            resourceName: category.name,
            changes: {
                before: oldValues,
                after: {
                    name: category.name,
                    isActive: category.isActive,
                },
            },
            description: `Updated category "${category.name}"`,
            req: request,
        });

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category updated successfully',
        });
    } catch (error) {
        console.error('Error updating category:', error);

        // Handle duplicate name error
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Category with this name already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE - Delete category (protected)
export async function DELETE(request, { params }) {
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

        const category = await Category.findById(params.id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        // Check if category has products
        const productCount = await Product.countDocuments({
            $or: [
                { category: category._id },
                { subcategory: category._id }
            ]
        });

        if (productCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Cannot delete category with ${productCount} associated products. Please reassign or delete products first.`
                },
                { status: 400 }
            );
        }

        // Check if category has subcategories
        const subcategoryCount = await Category.countDocuments({ parent: category._id });

        if (subcategoryCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Cannot delete category with ${subcategoryCount} subcategories. Please delete subcategories first.`
                },
                { status: 400 }
            );
        }

        const categoryName = category.name;

        await Category.findByIdAndDelete(params.id);

        // Log the action
        await logAuditAction({
            action: 'DELETE',
            resourceType: 'Category',
            resourceId: params.id,
            resourceName: categoryName,
            changes: {
                before: {
                    name: categoryName,
                },
                after: null,
            },
            description: `Deleted category "${categoryName}"`,
            req: request,
        });

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
