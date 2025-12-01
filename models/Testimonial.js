import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    // New fields for public submission form
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
    },
    avatarUrl: {
        type: String, // URL for user's avatar/photo
    },

    // Legacy fields (backward compatibility)
    customerName: {
        type: String,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String, // Cloudinary URL (optional)
    },

    // Common fields
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    approved: {
        type: Boolean,
        default: false, // Default to false for public submissions (requires admin approval)
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Virtual getter to support both name field conventions
testimonialSchema.virtual('displayName').get(function () {
    return this.name || this.customerName || 'Anonymous';
});

// Virtual getter to support both message field conventions
testimonialSchema.virtual('displayMessage').get(function () {
    return this.message || this.text || '';
});

// Ensure virtuals are included in JSON output
testimonialSchema.set('toJSON', { virtuals: true });
testimonialSchema.set('toObject', { virtuals: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
