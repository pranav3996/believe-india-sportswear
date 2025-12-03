import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const metadata = {
    title: 'User Dashboard - Believe India',
    description: 'User dashboard for Believe India Sportswear',
};

export default async function UserLayout({ children }) {
    const session = await getServerSession(authOptions);

    // Redirect if not authenticated or not a user
    if (!session || session.user?.role !== 'user') {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Navigation */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">
                                Believe India
                            </h1>
                            <p className="text-sm text-gray-600">
                                Welcome, {session.user.name}
                            </p>
                        </div>
                        <nav className="flex items-center space-x-4">
                            <a
                                href="/user/dashboard"
                                className="text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Dashboard
                            </a>
                            <a
                                href="/user/testimonials"
                                className="text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Testimonials
                            </a>
                            <a
                                href="/user/profile"
                                className="text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Profile
                            </a>
                            <form action="/api/auth/signout" method="POST">
                                <button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </form>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content - increased top padding to prevent header overlap */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </main>
        </div>
    );
}
