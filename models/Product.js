import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    size: {
        type: String,
        required: [true, 'Variant size is required'],
    },
    color: {
        name: {
            type: String,
            required: [true, 'Variant color name is required'],
        },
        hex: String,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
    },
    price: {
        type: Number,
        required: [true, 'Variant price is required'],
        min: 0,
    },
    compareAtPrice: {
        type: Number, // Original price for showing discounts
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    lowStockThreshold: {
        type: Number,
        default: 5,
    },
    images: [String], // Variant-specific images
    isActive: {
        type: Boolean,
        default: true,
    },
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    features: [{
        type: String,
    }],
    images: [{
        type: String, // Cloudinary URLs - general product images
    }],
    variants: [variantSchema],
    basePrice: {
        type: Number,
        default: 0, // Base price, actual prices are in variants
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published',
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    // SEO fields
    metaTitle: String,
    metaDescription: String,
    tags: [String],
    // Analytics
    viewCount: {
        type: Number,
        default: 0,
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
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Auto-calculate inStock based on variants
    if (this.variants && this.variants.length > 0) {
        const totalStock = this.variants.reduce((sum, variant) => sum + variant.stock, 0);
        this.inStock = totalStock > 0;
    }

    this.updatedAt = Date.now();
    next();
});

// Virtual for getting total stock
productSchema.virtual('totalStock').get(function () {
    if (!this.variants || this.variants.length === 0) return 0;
    return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
});

// Virtual for getting price range
productSchema.virtual('priceRange').get(function () {
    if (!this.variants || this.variants.length === 0) return null;
    const prices = this.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`;
});

// Index for better query performance
// Note: slug already has unique index from schema definition
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema);

