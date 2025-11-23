import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Jerseys', 'Shorts', 'Track Pants', 'T-Shirts', 'Jackets'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    features: [{
        type: String,
    }],
    images: [{
        type: String, // Cloudinary URLs
    }],
    price: {
        type: String, // String to allow "Contact for price" or ranges
        default: 'Contact for price',
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: false,
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
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
