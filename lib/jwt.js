import jwt from 'jsonwebtoken';

/**
 * JWT Helper Functions for Custom Authentication
 * Used for custom auth endpoints alongside NextAuth
 */

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
const TOKEN_EXPIRATION = '7d'; // 7 days

/**
 * Sign a JWT token with user data
 * @param {Object} payload - User data to encode in token
 * @returns {string} - Signed JWT token
 */
export function signToken(payload) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
    });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(token) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return null;
    }
}

/**
 * Extract token from cookie header
 * @param {string} cookieHeader - Cookie header string
 * @param {string} cookieName - Name of the cookie containing the token
 * @returns {string|null} - Token value or null if not found
 */
export function extractTokenFromCookie(cookieHeader, cookieName = 'auth-token') {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    const authCookie = cookies.find(cookie => cookie.startsWith(`${cookieName}=`));

    if (!authCookie) return null;

    return authCookie.split('=')[1];
}

/**
 * Create a sanitized user object (removes password)
 * @param {Object} user - User object from database
 * @returns {Object} - Sanitized user object
 */
export function sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...sanitized } = userObj;

    // Convert _id to id for consistency
    if (sanitized._id) {
        sanitized.id = sanitized._id.toString();
        delete sanitized._id;
    }

    return sanitized;
}
