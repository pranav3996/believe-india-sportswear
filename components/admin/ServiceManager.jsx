'use client';

import { useState } from 'react';
import ServiceList from './ServiceList';
import ServiceForm from './ServiceForm';

/**
 * Main container component for service management
 * Handles tab navigation between list view and create view
 */
export default function ServiceManager() {
    const [activeTab, setActiveTab] = useState('list');
    const [editingService, setEditingService] = useState(null);

    const handleEdit = (service) => {
        setEditingService(service);
        setActiveTab('form');
    };

    const handleFormSuccess = () => {
        setEditingService(null);
        setActiveTab('list');
    };

    const handleCancelForm = () => {
        setEditingService(null);
        setActiveTab('list');
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Service tabs">
                    <button
                        onClick={() => {
                            setEditingService(null);
                            setActiveTab('list');
                        }}
                        className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 ${activeTab === 'list'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        All Services
                    </button>
                    <button
                        onClick={() => {
                            setEditingService(null);
                            setActiveTab('form');
                        }}
                        className={`py-4 px-2 font-semibold border-b-2 transition-colors duration-300 ${activeTab === 'form'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        {editingService ? 'Edit Service' : 'Create New'}
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'list' && (
                    <ServiceList onEdit={handleEdit} />
                )}
                {activeTab === 'form' && (
                    <ServiceForm
                        service={editingService}
                        onSuccess={handleFormSuccess}
                        onCancel={handleCancelForm}
                    />
                )}
            </div>
        </div>
    );
}
