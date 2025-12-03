'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
    const [status, setStatus] = useState('verifying'); // verifying, success, error, expired
    const [message, setMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const verifyEmail = useCallback(async (token) => {
        try {
            const response = await fetch(`/api/auth/verify-email?token=${token}`);
            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.message);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 3000);
            } else {
                if (data.expired) {
                    setStatus('expired');
                } else {
                    setStatus('error');
                }
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage('Verification failed. Please try again.');
        }
    }, [router]);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        // Verify the email
        verifyEmail(token);
    }, [searchParams, verifyEmail]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-display font-bold gradient-text mb-2">
                        Email Verification
                    </h2>
                </div>

                <div className="glass-effect rounded-2xl shadow-xl p-8">
                    {status === 'verifying' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                            <p className="text-gray-700 text-lg">Verifying your email...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="mb-4">
                                <svg
                                    className="w-16 h-16 text-green-500 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-green-600 mb-2">
                                Email Verified!
                            </h3>
                            <p className="text-gray-700 mb-4">{message}</p>
                            <p className="text-sm text-gray-600">
                                Redirecting to login page...
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="mb-4">
                                <svg
                                    className="w-16 h-16 text-red-500 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-red-600 mb-2">
                                Verification Failed
                            </h3>
                            <p className="text-gray-700 mb-6">{message}</p>
                            <Link
                                href="/login"
                                className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {status === 'expired' && (
                        <div className="text-center">
                            <div className="mb-4">
                                <svg
                                    className="w-16 h-16 text-yellow-500 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-yellow-600 mb-2">
                                Link Expired
                            </h3>
                            <p className="text-gray-700 mb-6">{message}</p>
                            <Link
                                href="/resend-verification"
                                className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Request New Verification Email
                            </Link>
                        </div>
                    )}
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

export default function VerifyEmail() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg">Loading...</p>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
