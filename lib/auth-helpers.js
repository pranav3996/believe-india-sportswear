import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

/**
 * Server-side authentication helper for API routes
 * Checks if the user is authenticated and has admin role
 * 
 * @returns {Promise<{session: object, error: null} | {session: null, error: object}>}
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return {
            session: null,
            error: {
                success: false,
                error: 'Authentication required',
                status: 401,
            },
        };
    }

    if (session.user?.role !== 'admin') {
        return {
            session: null,
            error: {
                success: false,
                error: 'Admin access required',
                status: 403,
            },
        };
    }

    return {
        session,
        error: null,
    };
}

/**
 * Check if a session belongs to an admin user
 * 
 * @param {object} session - NextAuth session object
 * @returns {boolean}
 */
export function isAdmin(session) {
    return session?.user?.role === 'admin';
}

/**
 * Get current session without requiring admin role
 * 
 * @returns {Promise<object|null>}
 */
export async function getCurrentSession() {
    return await getServerSession(authOptions);
}

/**
 * Create unauthorized response
 * 
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Response}
 */
export function unauthorizedResponse(message = 'Unauthorized', status = 401) {
    return new Response(
        JSON.stringify({
            success: false,
            error: message,
        }),
        {
            status,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}
