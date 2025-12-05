import AuditLog from '../models/AuditLog';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

/**
 * Log an admin action to the audit log
 * @param {Object} params - Audit log parameters
 * @param {string} params.action - Action type (CREATE, UPDATE, DELETE, etc.)
 * @param {string} params.resourceType - Resource type (Product, Category, Order, etc.)
 * @param {string} params.resourceId - ID of the resource
 * @param {string} params.resourceName - Human readable name of the resource
 * @param {Object} params.changes - Changes object with before/after states
 * @param {string} params.description - Human readable description
 * @param {Object} params.req - Request object (optional, for IP and user agent)
 */
export async function logAuditAction({
    action,
    resourceType,
    resourceId,
    resourceName,
    changes = null,
    description,
    req = null,
}) {
    try {
        // Get the current session to identify the admin
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error('Cannot log audit action: No authenticated user');
            return null;
        }

        const auditData = {
            admin: session.user.id,
            adminEmail: session.user.email,
            action,
            resourceType,
            resourceId,
            resourceName,
            changes,
            description,
            ipAddress: req ? getClientIP(req) : null,
            userAgent: req ? req.headers.get('user-agent') : null,
        };

        const auditLog = await AuditLog.create(auditData);
        return auditLog;
    } catch (error) {
        console.error('Failed to log audit action:', error);
        // Don't throw error - audit logging should not break the main operation
        return null;
    }
}

/**
 * Get client IP address from request
 */
function getClientIP(req) {
    const forwarded = req.headers.get('x-forwarded-for');
    const real = req.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    if (real) {
        return real;
    }
    return req.ip || 'unknown';
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs({
    adminId = null,
    action = null,
    resourceType = null,
    startDate = null,
    endDate = null,
    limit = 50,
    skip = 0,
}) {
    try {
        const query = {};

        if (adminId) query.admin = adminId;
        if (action) query.action = action;
        if (resourceType) query.resourceType = resourceType;

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query)
            .populate('admin', 'name email')
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip);

        const total = await AuditLog.countDocuments(query);

        return { logs, total };
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        throw error;
    }
}

/**
 * Export audit logs to CSV
 */
export function exportAuditLogsToCSV(logs) {
    const headers = ['Timestamp', 'Admin', 'Action', 'Resource Type', 'Resource Name', 'Description', 'IP Address'];
    const rows = logs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.adminEmail || log.admin?.email || 'Unknown',
        log.action,
        log.resourceType,
        log.resourceName || log.resourceId,
        log.description || '',
        log.ipAddress || '',
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
}
