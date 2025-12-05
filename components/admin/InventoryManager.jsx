'use client';

export default function InventoryManager() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
                <p className="text-gray-600 mt-1">Monitor and manage product stock levels</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Inventory Module Coming Soon!</h3>
                <p className="text-gray-600 mb-6">
                    The inventory management system is currently being developed. <br />
                    You'll be able to track stock levels and manage inventory here.
                </p>
                <div className="inline-block bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left max-w-md">
                    <h4 className="font-bold text-gray-900 mb-3">✨ Features in Development:</h4>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">→</span>
                            <span>View all product variants with stock levels</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">→</span>
                            <span>Low-stock and out-of-stock alerts</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">→</span>
                            <span>Manual stock adjustments with audit trail</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">→</span>
                            <span>Bulk stock updates</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">→</span>
                            <span>Stock history and movement tracking</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
