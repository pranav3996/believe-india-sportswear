import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        default: 'Untitled',
    },
    url: {
        type: String,
        required: [true, 'Image URL is required'],
    },
    publicId: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Sort by timestamp descending by default
gallerySchema.index({ timestamp: -1 });

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
