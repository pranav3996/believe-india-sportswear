import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/db';
import Product from '../../../../models/Product';
import { logAuditAction } from '../../../../lib/auditLog';
import { hasPermission, PERMISSIONS } from '../../../../lib/permissions';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch single product (public)
export async function GET(request, { params }) {
    try {
        await connectDB();

        const product = await Product.findById(params.id)
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug');

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Increment view count
        product.viewCount += 1;
        await product.save();

        return NextResponse.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT - Update product (protected)
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
        if (!hasPermission(session.user, PERMISSIONS.PRODUCTS_EDIT)) {
            return NextResponse.json(
                { success: false, error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        await connectDB();

        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        const data = await request.json();

        // Store old values for audit log
        const oldValues = {
            name: product.name,
            status: product.status,
            variantsCount: product.variants.length,
        };

        // Update product
        Object.assign(product, data);
        product.updatedAt = Date.now();
        await product.save();

        await product.populate('category', 'name');

        // Log the action
        await logAuditAction({
            action: 'UPDATE',
            resourceType: 'Product',
            resourceId: product._id.toString(),
            resourceName: product.name,
            changes: {
                before: oldValues,
                after: {
                    name: product.name,
                    status: product.status,
                    variantsCount: product.variants.length,
                },
            },
            description: `Updated product "${product.name}"`,
            req: request,
        });

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product updated successfully',
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE - Delete product (soft delete - set to archived)
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
        if (!hasPermission(session.user, PERMISSIONS.PRODUCTS_DELETE)) {
            return NextResponse.json(
                { success: false, error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        await connectDB();

        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        const productName = product.name;
        const oldStatus = product.status;

        // Soft delete - set status to archived
        product.status = 'archived';
        await product.save();

        // Log the action
        await logAuditAction({
            action: 'DELETE',
            resourceType: 'Product',
            resourceId: product._id.toString(),
            resourceName: productName,
            changes: {
                before: { status: oldStatus },
                after: { status: 'archived' },
            },
            description: `Archived product "${productName}"`,
            req: request,
        });

        return NextResponse.json({
            success: true,
            message: 'Product archived successfully',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
