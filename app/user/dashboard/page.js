import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import Link from 'next/link';

export const metadata = {
    title: 'Dashboard - Believe India',
};

export default async function UserDashboard() {
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="glass-effect rounded-2xl p-8">
                <h2 className="text-3xl font-bold gradient-text mb-4">
                    Welcome back, {session?.user?.name}!
                </h2>
                <p className="text-gray-600">
                    Manage your profile, submit testimonials, and view your order history.
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Link href="/user/profile">
                    <div className="glass-effect rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                My Profile
                            </h3>
                            <svg
                                className="w-8 h-8 text-primary-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                            View and update your profile information
                        </p>
                    </div>
                </Link>

                {/* Testimonials Card */}
                <Link href="/user/testimonials">
                    <div className="glass-effect rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Testimonials
                            </h3>
                            <svg
                                className="w-8 h-8 text-accent-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                            Submit and manage your testimonials
                        </p>
                    </div>
                </Link>

                {/* Orders Card */}
                <div className="glass-effect rounded-xl p-6 opacity-75">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Order History
                        </h3>
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                        Coming soon - View your order history
                    </p>
                </div>
            </div>

            {/* Account Information */}
            <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="text-lg font-medium text-gray-800">
                            {session?.user?.name}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-medium text-gray-800">
                            {session?.user?.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Account Type</p>
                        <p className="text-lg font-medium text-gray-800 capitalize">
                            {session?.user?.role}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-lg font-medium text-gray-800">
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
