'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    // Redirect if already logged in
    if (session) {
        router.push(session.user.role === 'admin' ? '/admin' : '/user/dashboard');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!email || !email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setEmail('');
            } else {
                // Even on error, show success message for security
                setSuccess('If an account exists with this email, you will receive a password reset link shortly.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            // Show success message even on error for security
            setSuccess('If an account exists with this email, you will receive a password reset link shortly.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-display font-bold gradient-text mb-2">
                        Forgot Password?
                    </h2>
                    <p className="text-gray-600">
                        No worries, we&apos;ll send you reset instructions
                    </p>
                </div>

                {/* Form */}
                <div className="glass-effect rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-slide-down">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded animate-slide-down">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">{success}</p>
                                        <p className="text-xs text-green-600 mt-2">
                                            📧 Check your inbox and spam folder
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="your@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
        </div>
    );
}
