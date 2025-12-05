'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import ImageUpload from '../../components/admin/ImageUpload';
import CompanyForm from '../../components/admin/CompanyForm';
import GalleryManager from '../../components/admin/GalleryManager';
import ServiceManager from '../../components/admin/ServiceManager';
import TestimonialManager from '../../components/admin/TestimonialManager';
import AdminUsers from './users/page';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('upload');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return; // Don't do anything while loading

        if (status === 'unauthenticated') {
            // No session at all - redirect to login
            router.push('/login');
        } else if (session?.user?.role === 'user') {
            // Logged in but as user, not admin - redirect to user dashboard
            router.push('/user/dashboard');
        }
    }, [status, session, router]);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            await signOut({ redirect: false });

            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been successfully logged out',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                router.push('/login');
            }, 1500);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Welcome back, {session.user.email}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                View Website →
                            </a>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'upload'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Upload Images
                            </button>
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'gallery'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Manage Gallery
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'services'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Services
                            </button>
                            <button
                                onClick={() => setActiveTab('testimonials')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'testimonials'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Testimonials
                            </button>
                            <button
                                onClick={() => setActiveTab('company')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'company'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Company Details
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'users'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                User Management
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'security'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Account Security
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'upload' && <ImageUpload />}
                        {activeTab === 'gallery' && <GalleryManager />}
                        {activeTab === 'services' && <ServiceManager />}
                        {activeTab === 'testimonials' && <TestimonialManager />}
                        {activeTab === 'company' && <CompanyForm />}
                        {activeTab === 'users' && <AdminUsers />}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h3>
                                    <p className="text-gray-600">Manage your account security settings</p>
                                </div>

                                {/* Admin Info Card */}
                                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-200">
                                    <div className="flex items-center mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {session?.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-bold text-gray-900">{session?.user?.name}</h4>
                                            <p className="text-gray-600">{session?.user?.email}</p>
                                            <span className="inline-block mt-1 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                                                Administrator
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Options */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                                    {/* Change Password */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="w-6 h-6 text-primary-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <h5 className="text-base font-semibold text-gray-900">Password</h5>
                                                    <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                                                </div>
                                            </div>
                                            <a
                                                href="/change-password"
                                                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
                                            >
                                                Change Password
                                            </a>
                                        </div>
                                    </div>

                                    {/* Security Tips */}
                                    <div className="p-6 bg-gray-50">
                                        <h5 className="text-base font-semibold text-gray-900 mb-3">Security Best Practices</h5>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Use a strong, unique password with at least 8 characters
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Include uppercase, lowercase, numbers, and special characters
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Change your password regularly (every 3-6 months)
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Never share your password with anyone
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
