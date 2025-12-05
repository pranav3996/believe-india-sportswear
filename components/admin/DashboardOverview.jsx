'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardOverview() {
    const { data: productsData } = useSWR('/api/products?limit=1000', fetcher);
    const { data: categoriesData } = useSWR('/api/categories', fetcher);

    const [stats, setStats] = useState({
        totalProducts: 0,
        publishedProducts: 0,
        draftProducts: 0,
        totalCategories: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
    });

    useEffect(() => {
        if (productsData?.data) {
            const products = productsData.data;
            const published = products.filter(p => p.status === 'published').length;
            const draft = products.filter(p => p.status === 'draft').length;

            let lowStock = 0;
            let outOfStock = 0;

            products.forEach(product => {
                if (product.variants) {
                    product.variants.forEach(variant => {
                        if (variant.stock === 0) {
                            outOfStock++;
                        } else if (variant.stock <= (variant.lowStockThreshold || 5)) {
                            lowStock++;
                        }
                    });
                }
            });

            setStats(prev => ({
                ...prev,
                totalProducts: products.length,
                publishedProducts: published,
                draftProducts: draft,
                lowStockProducts: lowStock,
                outOfStockProducts: outOfStock,
            }));
        }

        if (categoriesData?.data) {
            setStats(prev => ({
                ...prev,
                totalCategories: categoriesData.data.length,
            }));
        }
    }, [productsData, categoriesData]);

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: '🛍️',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: 'Published',
            value: stats.publishedProducts,
            icon: '✅',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Drafts',
            value: stats.draftProducts,
            icon: '📝',
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
        },
        {
            title: 'Categories',
            value: stats.totalCategories,
            icon: '📁',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: 'Low Stock',
            value: stats.lowStockProducts,
            icon: '⚠️',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
        },
        {
            title: 'Out of Stock',
            value: stats.outOfStockProducts,
            icon: '❌',
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center text-3xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alerts Section */}
            {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">⚠️ Stock Alerts</h3>
                    <div className="space-y-2">
                        {stats.lowStockProducts > 0 && (
                            <p className="text-orange-700">
                                <span className="font-semibold">{stats.lowStockProducts}</span> product variant{stats.lowStockProducts !== 1 ? 's are' : ' is'} running low on stock
                            </p>
                        )}
                        {stats.outOfStockProducts > 0 && (
                            <p className="text-red-700">
                                <span className="font-semibold">{stats.outOfStockProducts}</span> product variant{stats.outOfStockProducts !== 1 ? 's are' : ' is'} out of stock
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => window.location.hash = '#inventory'}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
                    >
                        View Inventory →
                    </button>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => window.location.hash = '#products/add'}
                        className="p-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-left"
                    >
                        <div className="text-2xl mb-2">➕</div>
                        <div className="font-semibold">Add Product</div>
                        <div className="text-sm opacity-90">Create new product</div>
                    </button>

                    <button
                        onClick={() => window.location.hash = '#categories/add'}
                        className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-left"
                    >
                        <div className="text-2xl mb-2">📁</div>
                        <div className="font-semibold">Add Category</div>
                        <div className="text-sm opacity-90">Create new category</div>
                    </button>

                    <button
                        onClick={() => window.location.hash = '#orders'}
                        className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-left"
                    >
                        <div className="text-2xl mb-2">📦</div>
                        <div className="font-semibold">View Orders</div>
                        <div className="text-sm opacity-90">Manage orders</div>
                    </button>

                    <button
                        onClick={() => window.location.hash = '#inventory'}
                        className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-left"
                    >
                        <div className="text-2xl mb-2">📊</div>
                        <div className="font-semibold">Check Inventory</div>
                        <div className="text-sm opacity-90">Stock levels</div>
                    </button>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Getting Started</h3>
                <div className="space-y-3 text-gray-600">
                    <div className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <p>Your admin dashboard is set up and ready!</p>
                    </div>
                    <div className="flex items-start">
                        <span className="text-blue-500 mr-2">→</span>
                        <p>Start by adding categories for your sportswear products</p>
                    </div>
                    <div className="flex items-start">
                        <span className="text-blue-500 mr-2">→</span>
                        <p>Then create products with variants (sizes, colors, prices)</p>
                    </div>
                    <div className="flex items-start">
                        <span className="text-blue-500 mr-2">→</span>
                        <p>Manage inventory to track stock levels</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
