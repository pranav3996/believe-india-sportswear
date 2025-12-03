'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function UserTestimonials() {
    const { data: session } = useSession();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        message: '',
        rating: 5,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserTestimonials();
        }
    }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchUserTestimonials = async () => {
        if (!session?.user?.email) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `/api/testimonials?userOnly=true&email=${encodeURIComponent(session.user.email)}`
            );
            const data = await response.json();

            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (err) {
            console.error('Error fetching testimonials:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const response = await fetch('/api/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to submit testimonial');
                return;
            }

            setSuccess('Testimonial submitted successfully!');
            setFormData({
                message: '',
                rating: 5,
            });

            // Refresh testimonials list
            setTimeout(() => {
                fetchUserTestimonials();
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Show sign-in message if not authenticated
    if (!session) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold gradient-text mb-2">
                        My Testimonials
                    </h2>
                    <p className="text-gray-600">
                        Share your experience and view your submitted testimonials
                    </p>
                </div>
                <div className="glass-effect rounded-2xl p-8 text-center">
                    <p className="text-gray-600 text-lg">
                        Please sign in to submit and view your testimonials.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold gradient-text mb-2">
                    My Testimonials
                </h2>
                <p className="text-gray-600">
                    Share your experience and view your submitted testimonials
                </p>
            </div>

            {/* Submit Testimonial Form */}
            <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Submit a Testimonial
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                        </label>
                        <select
                            id="rating"
                            name="rating"
                            required
                            value={formData.rating}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                            <option value={3}>⭐⭐⭐ (3 stars)</option>
                            <option value={2}>⭐⭐ (2 stars)</option>
                            <option value={1}>⭐ (1 star)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Testimonial
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            className="input-field resize-none"
                            placeholder="Share your experience with Believe India Sportswear..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {submitting ? 'Submitting...' : 'Submit Testimonial'}
                    </button>
                </form>
            </div>

            {/* User's Testimonials List */}
            <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Your Submitted Testimonials
                </h3>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading testimonials...</p>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">
                            You haven&apos;t submitted any testimonials yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial._id}
                                className="border border-gray-200 rounded-lg p-6 bg-white"
                            >
                                <div className="flex items-center mb-2">
                                    <span className="text-yellow-400">
                                        {'⭐'.repeat(testimonial.rating)}
                                    </span>
                                </div>
                                <p className="text-gray-700 mt-3">{testimonial.message}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Submitted on {new Date(testimonial.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}