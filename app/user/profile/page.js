import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export const metadata = {
    title: 'My Profile - Believe India',
};

export default async function UserProfile() {
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold gradient-text mb-2">
                    My Profile
                </h2>
                <p className="text-gray-600">
                    View and manage your account information
                </p>
            </div>

            {/* Profile Information */}
            <div className="glass-effect rounded-2xl p-8">
                <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                            {session?.user?.name}
                        </h3>
                        <p className="text-gray-600">{session?.user?.email}</p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Account Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={session?.user?.name || ''}
                                disabled
                                className="input-field bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={session?.user?.email || ''}
                                disabled
                                className="input-field bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Type
                            </label>
                            <input
                                type="text"
                                value={session?.user?.role || ''}
                                disabled
                                className="input-field bg-gray-50 cursor-not-allowed capitalize"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User ID
                            </label>
                            <input
                                type="text"
                                value={session?.user?.id || 'N/A'}
                                disabled
                                className="input-field bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon Features */}
            <div className="glass-effect rounded-2xl p-8 opacity-75">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Coming Soon
                </h4>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                        <svg
                            className="w-5 h-5 text-primary-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Edit profile information
                    </li>
                    <li className="flex items-center">
                        <svg
                            className="w-5 h-5 text-primary-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Change password
                    </li>
                    <li className="flex items-center">
                        <svg
                            className="w-5 h-5 text-primary-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Upload profile picture
                    </li>
                </ul>
            </div>
        </div>
    );
}
