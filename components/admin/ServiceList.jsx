'use client';

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import DeleteConfirmModal from './DeleteConfirmModal';

const fetcher = (url) => fetch(url).then((res) => res.json());

const CATEGORIES = [
    { value: '', label: 'All Categories' },
    { value: 'design', label: 'Design' },
    { value: 'ordering', label: 'Ordering' },
    { value: 'customization', label: 'Customization' },
    { value: 'quality', label: 'Quality' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'support', label: 'Support' },
    { value: 'other', label: 'Other' },
];

/**
 * Service listing component with pagination, search, and filters
 */
export default function ServiceList({ onEdit }) {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [deleteModal, setDeleteModal] = useState({ show: false, service: null });

    // Build API URL with query parameters
    const buildUrl = () => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            order,
        });
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        return `/api/services?${params.toString()}`;
    };

    // Fetch services using SWR
    const { data, error, isLoading } = useSWR(buildUrl(), fetcher, {
        revalidateOnFocus: false,
    });

    const handleDelete = async (serviceId) => {
        try {
            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                // Revalidate the data
                mutate(buildUrl());
                setDeleteModal({ show: false, service: null });

                // Show success message
                alert('Service deleted successfully!');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete service');
        }
    };

    const toggleFeatured = async (service) => {
        try {
            const response = await fetch(`/api/services/${service._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !service.featured }),
            });

            const result = await response.json();

            if (result.success) {
                mutate(buildUrl());
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Failed to update service');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Failed to load services. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to first page on search
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <div className="sm:w-48">
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="sm:w-40">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="createdAt">Date</option>
                        <option value="title">Title</option>
                        <option value="category">Category</option>
                        <option value="featured">Featured</option>
                    </select>
                </div>
                <button
                    onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title={`Sort ${order === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                    {order === 'asc' ? '↑' : '↓'}
                </button>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            )}

            {/* Services Table */}
            {!isLoading && data?.success && (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {data.data.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No services found.</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Try adjusting your search or filters.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Service
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.data.map((service) => (
                                            <tr key={service._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <span className="text-2xl mr-3">{service.icon}</span>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {service.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 max-w-md truncate">
                                                                {service.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                                                        {service.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => toggleFeatured(service)}
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${service.featured
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                    >
                                                        {service.featured ? '⭐ Featured' : 'Not Featured'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(service.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => onEdit(service)}
                                                        className="text-primary-600 hover:text-primary-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ show: true, service })}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {data.pagination && data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{data.pagination.count}</span> of{' '}
                                <span className="font-medium">{data.pagination.total}</span> services
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={!data.pagination.hasPrev}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {data.pagination.page} of {data.pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={!data.pagination.hasNext}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                show={deleteModal.show}
                service={deleteModal.service}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ show: false, service: null })}
            />
        </div>
    );
}
