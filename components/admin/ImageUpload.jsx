'use client';

import { useState } from 'react';

export default function ImageUpload() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage({ text: 'Please select an image', type: 'error' });
            return;
        }

        setUploading(true);
        setProgress(0);
        setMessage({ text: '', type: '' });

        try {
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);

            setProgress(30);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Upload failed');
            }

            setProgress(60);

            // Save to database
            const saveResponse = await fetch('/api/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title || 'Untitled',
                    url: uploadResult.data.url,
                    publicId: uploadResult.data.publicId,
                    timestamp: new Date(),
                }),
            });

            const saveResult = await saveResponse.json();

            if (!saveResult.success) {
                throw new Error(saveResult.error || 'Failed to save to database');
            }

            setProgress(100);
            setMessage({ text: 'Image uploaded successfully!', type: 'success' });

            // Reset form
            setTitle('');
            setFile(null);
            setPreview('');
            e.target.reset();
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ text: error.message || 'Failed to upload image', type: 'error' });
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(0), 2000);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Images</h2>
                <p className="text-gray-600">Add new images to your gallery</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
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
                        Image Title (Optional)
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-field"
                        placeholder="Enter image title"
                        disabled={uploading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                        disabled={uploading}
                    />
                </div>

                {preview && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {uploading && (
                    <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-primary-500 to-accent-500 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {uploading ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </span>
                        ) : (
                            'Upload Image'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
