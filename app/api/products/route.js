import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/db';
import Product from '../../../models/Product';

// GET - Fetch all products (public)
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }

        const products = await Product.find(query).sort({ featured: -1, createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST - Add new product (protected)
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

        const data = await request.json();

        const product = new Product(data);
        await product.save();

        return NextResponse.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
