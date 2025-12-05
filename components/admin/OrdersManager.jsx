'use client';

export default function OrdersManager() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Orders Management</h2>
                <p className="text-gray-600 mt-1">Track and manage customer orders</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Orders Module Coming Soon!</h3>
                <p className="text-gray-600 mb-6">
                    The order management system is currently being developed. <br />
                    You'll be able to view, track, and manage all customer orders here.
                </p>
                <div className="inline-block bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left max-w-md">
                    <h4 className="font-bold text-gray-900 mb-3">✨ Features in Development:</h4>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">→</span>
                            <span>View all orders with status filters</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">→</span>
                            <span>Update order status (Pending → Delivered)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">→</span>
                            <span>View customer details and shipping info</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">→</span>
                            <span>Generate and download invoices</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">→</span>
                            <span>Automatic stock deduction on order placement</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
