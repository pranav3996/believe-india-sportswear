import mongoose from 'mongoose';

/**
 * Service Schema
 * 
 * Represents a service offering from Believe India Sportswear
 * 
 * @property {string} title - Service name/title (required)
 * @property {string} description - Service description (required)
 * @property {string} icon - Icon identifier (emoji or icon name)
 * @property {string} image - Image URL/path for the service
 * @property {string} category - Service category for filtering
 * @property {boolean} featured - Whether to highlight this service
 * @property {string[]} features - Array of key features/benefits
 * @property {Date} createdAt - Creation timestamp (auto-generated)
 * @property {Date} updatedAt - Last update timestamp (auto-generated)
 */
const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Service title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    icon: {
        type: String,
        trim: true,
        default: '⚡', // Default icon if none provided
    },
    image: {
        type: String,
        trim: true,
        // Optional: Add URL validation
        // validate: {
        //     validator: function(v) {
        //         return /^(https?:\/\/)/.test(v);
        //     },
        //     message: 'Image must be a valid URL'
        // }
    },
    category: {
        type: String,
        trim: true,
        lowercase: true,
        enum: {
            values: ['design', 'ordering', 'customization', 'quality', 'delivery', 'support', 'other'],
            message: '{VALUE} is not a valid category'
        },
        default: 'other',
    },
    featured: {
        type: Boolean,
        default: false,
    },
    features: [{
        type: String,
        trim: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true, // Cannot be changed after creation
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for better query performance
serviceSchema.index({ category: 1, featured: -1 });
serviceSchema.index({ createdAt: -1 });

// Middleware: Update timestamp before saving
serviceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware: Update timestamp before findOneAndUpdate
serviceSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Virtual property: ID as string (for easier frontend use)
serviceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included in JSON output
serviceSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v; // Remove version key
        return ret;
    }
});

/**
 * Static method: Find featured services
 */
serviceSchema.statics.findFeatured = function () {
    return this.find({ featured: true }).sort({ createdAt: -1 });
};

/**
 * Static method: Find services by category
 */
serviceSchema.statics.findByCategory = function (category) {
    return this.find({ category }).sort({ featured: -1, createdAt: -1 });
};

// Export model - prevent model recompilation in development
export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
