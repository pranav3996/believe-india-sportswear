'use client';

import { useState, useEffect } from 'react';

const CATEGORIES = [
    { value: 'design', label: 'Design' },
    { value: 'ordering', label: 'Ordering' },
    { value: 'customization', label: 'Customization' },
    { value: 'quality', label: 'Quality' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'support', label: 'Support' },
    { value: 'other', label: 'Other' },
];

const EMOJI_ICONS = ['🎨', '📦', '⚙️', '✨', '🚀', '💎', '🏆', '⚡', '🎯', '🔧', '👕', '🧵', '✂️', '📏'];

/**
 * Form component for creating and editing services
 */
export default function ServiceForm({ service, onSuccess, onCancel }) {
    const isEditing = !!service;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: '⚡',
        category: 'other',
        featured: false,
        features: [''],
    });

    // Load service data when editing
    useEffect(() => {
        if (service) {
            setFormData({
                title: service.title || '',
                description: service.description || '',
                icon: service.icon || '⚡',
                category: service.category || 'other',
                featured: service.featured || false,
                features: service.features?.length > 0 ? service.features : [''],
            });
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error for this field
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData((prev) => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        if (formData.features.length < 10) {
            setFormData((prev) => ({
                ...prev,
                features: [...prev.features, ''],
            }));
        }
    };

    const removeFeature = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, features: newFeatures }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title cannot exceed 100 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        } else if (formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            // Filter out empty features
            const cleanedFeatures = formData.features.filter((f) => f.trim() !== '');

            const payload = {
                ...formData,
                features: cleanedFeatures,
            };

            const url = isEditing ? `/api/services/${service._id}` : '/api/services';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                alert(`Service ${isEditing ? 'updated' : 'created'} successfully!`);
                onSuccess();

                // Reset form if creating new
                if (!isEditing) {
                    setFormData({
                        title: '',
                        description: '',
                        icon: '⚡',
                        category: 'other',
                        featured: false,
                        features: [''],
                    });
                }
            } else {
                if (result.details) {
                    alert(`Validation errors:\n${result.details.join('\n')}`);
                } else {
                    alert(`Error: ${result.error}`);
                }
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Service' : 'Create New Service'}
            </h2>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="e.g., Custom Design Services"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Describe the service in detail..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                <p className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/1000 characters
                </p>
            </div>

            {/* Icon */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                    {EMOJI_ICONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                            className={`text-3xl p-2 rounded-lg border-2 transition-all ${formData.icon === emoji
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <div className="mt-2">
                    <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Custom emoji"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Featured */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Feature this service on the homepage
                </label>
            </div>

            {/* Features List */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Features (Optional)
                </label>
                <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder={`Feature ${index + 1}`}
                            />
                            {formData.features.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {formData.features.length < 10 && (
                    <button
                        type="button"
                        onClick={addFeature}
                        className="mt-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                        + Add Feature
                    </button>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {loading ? 'Saving...' : isEditing ? 'Update Service' : 'Create Service'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
