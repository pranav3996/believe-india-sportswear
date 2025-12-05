import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    adminEmail: String, // Store email for record keeping
    action: {
        type: String,
        required: true,
        enum: [
            'CREATE',
            'UPDATE',
            'DELETE',
            'LOGIN',
            'LOGOUT',
            'STATUS_CHANGE',
            'STOCK_UPDATE',
            'PERMISSION_CHANGE',
        ],
    },
    resourceType: {
        type: String,
        required: true,
        enum: [
            'Product',
            'Category',
            'Order',
            'User',
            'Customer',
            'Service',
            'Gallery',
            'Testimonial',
            'Banner',
            'About',
            'Admin',
            'Auth',
        ],
    },
    resourceId: {
        type: String, // Can be ObjectId or custom ID
    },
    resourceName: String, // Human readable resource name
    changes: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed,
    },
    description: String, // Human readable description of the action
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Index for better query performance
auditLogSchema.index({ admin: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resourceType: 1 });
auditLogSchema.index({ timestamp: -1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
