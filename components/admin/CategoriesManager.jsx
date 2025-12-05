'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Swal from 'sweetalert2';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CategoriesManager() {
    const { data, error, mutate } = useSWR('/api/categories', fetcher);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', parent: null });

    const categories = data?.data || [];

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!newCategory.name) {
            return Swal.fire('Error', 'Category name is required', 'error');
        }

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });

            const result = await res.json();

            if (res.ok) {
                Swal.fire('Success!', 'Category created successfully', 'success');
                setNewCategory({ name: '', description: '', parent: null });
                mutate();
            } else {
                Swal.fire('Error', result.error || 'Failed to create category', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to create category', 'error');
        }
    };

    const handleDelete = async (categoryId, categoryName) => {
        const result = await Swal.fire({
            title: 'Delete Category?',
            text: `Are you sure you want to delete "${categoryName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it',
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/categories/${categoryId}`, {
                    method: 'DELETE',
                });

                const data = await res.json();

                if (res.ok) {
                    Swal.fire('Deleted!', 'Category deleted successfully', 'success');
                    mutate();
                } else {
                    Swal.fire('Error', data.error || 'Failed to delete category', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete category', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Categories Management</h2>
                <p className="text-gray-600 mt-1">Organize your products with categories and subcategories</p>
            </div>

            {/* Add Category Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📁 Add New Category</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name*</label>
                        <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="e.g., T-Shirts"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
                        <select
                            value={newCategory.parent || ''}
                            onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value || null })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Main Category</option>
                            {categories.filter(c => !c.parent).map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                        >
                            ➕ Add Category
                        </button>
                    </div>
                </form>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="text-4xl mb-2">📁</div>
                                        <p>No categories yet. Create your first category!</p>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {category.parent ? '└─ ' : ''}
                                                {category.name}
                                            </div>
                                            {category.description && (
                                                <div className="text-sm text-gray-500">{category.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {category.parent ? 'Subcategory' : 'Main Category'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {category.productCount || category.subcategories?.length || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => Swal.fire('Coming Soon!', 'Edit category feature is being built', 'info')}
                                                className="text-green-600 hover:text-green-900"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id, category.name)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
