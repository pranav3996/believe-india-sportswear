/**
 * Permission definitions for role-based access control
 */
export const PERMISSIONS = {
    // Product permissions
    PRODUCTS_VIEW: 'products.view',
    PRODUCTS_CREATE: 'products.create',
    PRODUCTS_EDIT: 'products.edit',
    PRODUCTS_DELETE: 'products.delete',

    // Category permissions
    CATEGORIES_MANAGE: 'categories.manage',

    // Order permissions
    ORDERS_VIEW: 'orders.view',
    ORDERS_MANAGE: 'orders.manage',

    // Customer permissions
    CUSTOMERS_VIEW: 'customers.view',
    CUSTOMERS_MANAGE: 'customers.manage',

    // Content permissions
    CONTENT_MANAGE: 'content.manage',

    // Admin permissions
    ADMINS_MANAGE: 'admins.manage',

    // Analytics permissions
    ANALYTICS_VIEW: 'analytics.view',
};

/**
 * Role definitions with their default permissions
 */
export const ROLES = {
    SUPER_ADMIN: {
        name: 'super_admin',
        label: 'Super Admin',
        permissions: Object.values(PERMISSIONS), // All permissions
    },
    ADMIN: {
        name: 'admin',
        label: 'Admin',
        permissions: Object.values(PERMISSIONS), // All permissions
    },
    EDITOR: {
        name: 'editor',
        label: 'Editor',
        permissions: [
            PERMISSIONS.PRODUCTS_VIEW,
            PERMISSIONS.PRODUCTS_CREATE,
            PERMISSIONS.PRODUCTS_EDIT,
            PERMISSIONS.ORDERS_VIEW,
            PERMISSIONS.CUSTOMERS_VIEW,
            PERMISSIONS.CONTENT_MANAGE,
            PERMISSIONS.ANALYTICS_VIEW,
        ],
    },
    USER: {
        name: 'user',
        label: 'User',
        permissions: [], // No admin permissions
    },
};

/**
 * Check if a user has a specific permission
 * @param {Object} user - User object from session or database
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
    if (!user) return false;

    // Super admin and admin have all permissions
    if (user.role === 'super_admin' || user.role === 'admin') {
        return true;
    }

    // Check if user has specific permission
    if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
    }

    // Check role-based permissions
    const userRole = ROLES[user.role?.toUpperCase()];
    if (userRole && userRole.permissions) {
        return userRole.permissions.includes(permission);
    }

    return false;
}

/**
 * Check if a user has any of the specified permissions
 * @param {Object} user - User object
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export function hasAnyPermission(user, permissions) {
    return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 * @param {Object} user - User object
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export function hasAllPermissions(user, permissions) {
    return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Check if a user is an admin (any admin role)
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function isAdmin(user) {
    if (!user) return false;
    return ['super_admin', 'admin', 'editor'].includes(user.role);
}

/**
 * Check if a user is a super admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function isSuperAdmin(user) {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'admin';
}

/**
 * Get all permissions for a user
 * @param {Object} user - User object
 * @returns {string[]}
 */
export function getUserPermissions(user) {
    if (!user) return [];

    // Super admin and admin have all permissions
    if (user.role === 'super_admin' || user.role === 'admin') {
        return Object.values(PERMISSIONS);
    }

    // Return user's specific permissions
    if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions;
    }

    // Return role-based permissions
    const userRole = ROLES[user.role?.toUpperCase()];
    return userRole?.permissions || [];
}

/**
 * Middleware to check permissions for API routes
 */
export function requirePermission(permission) {
    return async (user) => {
        if (!user) {
            throw new Error('Authentication required');
        }

        if (!hasPermission(user, permission)) {
            throw new Error('Insufficient permissions');
        }

        return true;
    };
}
