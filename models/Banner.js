import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Banner title is required'],
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String, // Cloudinary URL
        required: [true, 'Banner image is required'],
    },
    mobileImage: {
        type: String, // Optional mobile-specific image
    },
    link: {
        url: String,
        openInNewTab: {
            type: Boolean,
            default: false,
        },
    },
    buttonText: {
        type: String,
        default: 'Learn More',
    },
    order: {
        type: Number,
        default: 0, // Lower numbers appear first
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    // Scheduling
    startDate: {
        type: Date,
        default: null, // null means no start restriction
    },
    endDate: {
        type: Date,
        default: null, // null means no end restriction
    },
    // Styling options
    textColor: {
        type: String,
        default: '#FFFFFF',
    },
    overlayOpacity: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.4,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update timestamp on save
bannerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to check if banner should be displayed
bannerSchema.methods.isVisible = function () {
    if (!this.isActive) return false;

    const now = new Date();

    if (this.startDate && now < this.startDate) return false;
    if (this.endDate && now > this.endDate) return false;

    return true;
};

// Index for better query performance
bannerSchema.index({ order: 1 });
bannerSchema.index({ isActive: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
