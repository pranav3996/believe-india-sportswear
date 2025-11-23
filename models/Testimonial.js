import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5,
        default: 5,
    },
    text: {
        type: String,
        required: [true, 'Testimonial text is required'],
    },
    image: {
        type: String, // Cloudinary URL (optional)
    },
    featured: {
        type: Boolean,
        default: false,
    },
    approved: {
        type: Boolean,
        default: true, // Admin can control which testimonials to show
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
