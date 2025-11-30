'use client';

import { useEffect } from 'react';

/**
 * Delete confirmation modal component
 */
export default function DeleteConfirmModal({ show, service, onConfirm, onCancel }) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && show) {
                onCancel();
            }
        };

        if (show) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [show, onCancel]);

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete Service
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete this service? This action cannot be undone.
                        </p>
                        {service && (
                            <div className="bg-gray-50 rounded-lg p-3 text-left">
                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                    <span className="text-2xl mr-2">{service.icon}</span>
                                    {service.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    {service.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => service && onConfirm(service._id)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Delete
                        </button>
                    </div>

                    {/* Keyboard hint */}
                    <p className="text-xs text-gray-400 text-center mt-4">
                        Press <kbd className="px-1 bg-gray-100 rounded">Esc</kbd> to cancel
                    </p>
                </div>
            </div>
        </>
    );
}
