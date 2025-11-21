'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/gallery');
            const result = await response.json();

            if (result.success) {
                setImages(result.data);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (imageId, title) => {
        if (!confirm(`Are you sure you want to delete "${title || 'this image'}"?`)) {
            return;
        }

        setDeleting(imageId);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch(`/api/gallery/${imageId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ text: 'Image deleted successfully!', type: 'success' });
                // Remove from local state
                setImages(images.filter(img => img._id !== imageId));
            } else {
                setMessage({ text: result.error || 'Failed to delete image', type: 'error' });
            }
        } catch (error) {
            console.error('Delete error:', error);
            setMessage({ text: 'Failed to delete image', type: 'error' });
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Gallery</h2>
                <p className="text-gray-600">View and delete images from your gallery</p>
            </div>

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

            {images.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-gray-600">No images in gallery yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <div
                            key={image._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={image.url}
                                    alt={image.title || 'Gallery image'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                    {image.title || 'Untitled'}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    {new Date(image.timestamp).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => handleDelete(image._id, image.title)}
                                    disabled={deleting === image._id}
                                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {deleting === image._id ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
