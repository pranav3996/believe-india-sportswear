import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';
import Gallery from '../../../../models/Gallery';
import connectDB from '../../../../lib/db';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DELETE: Remove image (protected)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { id } = params;

        const image = await Gallery.findById(id);

        if (!image) {
            return NextResponse.json(
                { success: false, error: 'Image not found' },
                { status: 404 }
            );
        }

        // Delete from Cloudinary if publicId exists
        if (image.publicId) {
            try {
                await cloudinary.uploader.destroy(image.publicId);
            } catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
                // Continue with database deletion even if Cloudinary fails
            }
        }

        await Gallery.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
