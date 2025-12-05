import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null, // null means it's a main category
    },
    image: {
        type: String, // Cloudinary URL
    },
    // Category-specific attributes
    attributes: {
        availableSizes: [{
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42'],
        }],
        availableColors: [{
            name: String, // e.g., "Red", "Blue", "Black"
            hex: String,  // e.g., "#FF0000"
        }],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0, // For sorting categories
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

// Generate slug from name before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    this.updatedAt = Date.now();
    next();
});

// Index for better query performance
// Note: slug already has unique index from schema definition
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
