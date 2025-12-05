import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'super_admin', 'editor'],
        default: 'user',
    },
    // Customer-specific fields
    phone: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India',
        },
    },
    // Admin-specific fields
    permissions: [{
        type: String,
        enum: [
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'categories.manage',
            'orders.view',
            'orders.manage',
            'customers.view',
            'customers.manage',
            'content.manage',
            'admins.manage',
            'analytics.view',
        ],
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpiry: {
        type: Date,
        default: null,
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiry: {
        type: Date,
        default: null,
    },
    lastLogin: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to generate verification token
userSchema.methods.generateVerificationToken = function () {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = token;
    this.verificationTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    return token;
};

// Method to generate password reset token
userSchema.methods.generateResetToken = function () {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    this.resetToken = token;
    this.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return token;
};

// Method to check if user has permission
userSchema.methods.hasPermission = function (permission) {
    // Super admin has all permissions
    if (this.role === 'super_admin' || this.role === 'admin') {
        return true;
    }

    // Check if user has specific permission
    return this.permissions && this.permissions.includes(permission);
};

// Virtual for order history
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'customer',
});

export default mongoose.models.User || mongoose.model('User', userSchema);

