import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    // User information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
