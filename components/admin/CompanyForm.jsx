'use client';

import { useState, useEffect } from 'react';

export default function CompanyForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [initialLoading, setInitialLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        ownerImage: '',
        instagram: '',
        instagramLink: '',
        location: '',
        contactPerson: '',
        phone: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/about');
            const result = await response.json();

            if (result.success && result.data) {
                setFormData(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setMessage({ text: '', type: '' });

        try {
            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to Cloudinary
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Upload failed');
            }

            // Update form data with new image URL
            setFormData((prev) => ({ ...prev, ownerImage: uploadResult.data.url }));
            setMessage({ text: 'Image uploaded successfully!', type: 'success' });
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ text: error.message || 'Failed to upload image', type: 'error' });
            setImagePreview('');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch('/api/about', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setMessage({
                    text: 'Company details updated successfully!',
                    type: 'success',
                });
            } else {
                setMessage({
                    text: result.error || 'Failed to update details',
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Error updating data:', error);
            setMessage({
                text: 'An error occurred. Please try again.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-32 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Details</h2>
                <p className="text-gray-600">Update your company information displayed on the website</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-lg border-l-4 animate-slide-down ${message.type === 'success'
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                            }`}
                    >
                        <div className="flex items-center">
                            <span
                                className={`text-sm font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-700'
                                    }`}
                            >
                                {message.text}
                            </span>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                    </label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="input-field resize-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Owner/Company Image
                    </label>

                    {(formData.ownerImage || imagePreview) && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 mb-4">
                            <img
                                src={imagePreview || formData.ownerImage}
                                alt="Owner preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                            id="ownerImageUpload"
                        />
                        <label
                            htmlFor="ownerImageUpload"
                            className={`flex-1 cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploadingImage ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload Image
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Instagram Handle
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="@believeindia"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Instagram Link
                        </label>
                        <input
                            type="url"
                            name="instagramLink"
                            value={formData.instagramLink}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="https://instagram.com/believeindia"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="India"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contact Person
                        </label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="+91 1234567890"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Saving...
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
