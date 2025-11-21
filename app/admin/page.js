'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import ImageUpload from '../../components/admin/ImageUpload';
import CompanyForm from '../../components/admin/CompanyForm';
import GalleryManager from '../../components/admin/GalleryManager';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('upload');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router]);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/admin/login');
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
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 ${activeTab === 'upload'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Upload Images
                            </button>
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 ${activeTab === 'gallery'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Manage Gallery
                            </button>
                            <button
                                onClick={() => setActiveTab('company')}
                                className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 ${activeTab === 'company'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Company Details
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'upload' && <ImageUpload />}
                        {activeTab === 'gallery' && <GalleryManager />}
                        {activeTab === 'company' && <CompanyForm />}
                    </div>
                </div>
            </main>
        </div>
    );
}
