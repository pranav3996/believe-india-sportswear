'use client';

import { useState } from 'react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'Ordering',
            questions: [
                {
                    q: 'What is the minimum order quantity?',
                    a: 'Our minimum order quantity varies by product type. For team jerseys and custom orders, we typically require a minimum of 10-15 pieces. For standard products, you can order even a single piece. Contact us for specific requirements.'
                },
                {
                    q: 'How do I place an order?',
                    a: 'You can place an order by contacting us via phone, email, or our contact form. Our team will guide you through the design selection, customization options, sizing, and pricing. We provide samples and mockups before production.'
                },
                {
                    q: 'Can I get a sample before placing a bulk order?',
                    a: 'Yes! We can provide samples for your review before proceeding with bulk orders. Sample charges may apply and can be adjusted against your final order value.'
                }
            ]
        },
        {
            category: 'Customization',
            questions: [
                {
                    q: 'What customization options are available?',
                    a: 'We offer complete customization including team logos, player names and numbers, color combinations, design patterns, and sponsor logos. We use sublimation printing, embroidery, and heat transfer techniques based on your requirements.'
                },
                {
                    q: 'Can you match specific colors?',
                    a: 'Yes, we can match specific Pantone colors or provide color swatches for your approval. Our team ensures accurate color reproduction in the final product.'
                },
                {
                    q: 'Do you provide design assistance?',
                    a: 'Absolutely! Our design team can help create custom designs or modify existing templates. We provide digital mockups for your approval before production begins.'
                }
            ]
        },
        {
            category: 'Shipping & Delivery',
            questions: [
                {
                    q: 'What is the typical production time?',
                    a: 'Standard production time is 15-20 business days from design approval and payment confirmation. Rush orders may be available for urgent requirements with additional charges.'
                },
                {
                    q: 'Do you ship across India?',
                    a: 'Yes, we ship pan-India through reliable courier partners. Shipping charges vary based on location and order value. Free shipping may be available for bulk orders.'
                },
                {
                    q: 'Can I track my order?',
                    a: 'Yes! Once your order ships, we provide tracking information so you can monitor delivery status in real-time.'
                }
            ]
        },
        {
            category: 'Quality & Materials',
            questions: [
                {
                    q: 'What materials do you use?',
                    a: 'We use premium quality fabrics including moisture-wicking polyester, breathable mesh, and durable blends. All materials are tested for comfort, durability, and performance.'
                },
                {
                    q: 'Are the prints durable?',
                    a: 'Yes! We use sublimation printing which ensures colors don\'t fade or peel even after multiple washes. All prints are tested for durability and wash-fastness.'
                },
                {
                    q: 'Do you provide quality guarantees?',
                    a: 'Yes, all our products come with quality assurance. If you receive any defective items, we provide replacements at no extra cost.'
                }
            ]
        },
        {
            category: 'Payment & Pricing',
            questions: [
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept bank transfers, UPI, credit/debit cards, and cheques. For bulk orders, we can discuss flexible payment terms.'
                },
                {
                    q: 'Do you offer discounts for bulk orders?',
                    a: 'Yes! We offer competitive pricing for bulk orders. The more you order, the better the unit price. Contact us for a detailed quote.'
                },
                {
                    q: 'Is GST included in the price?',
                    a: 'GST is applicable as per government regulations and will be mentioned separately in the quotation and invoice.'
                }
            ]
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    let globalIndex = 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-display font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Find answers to common questions about our products and services
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="container mx-auto px-4 py-16 max-w-4xl">
                {faqs.map((category, catIndex) => (
                    <div key={catIndex} className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-1 h-8 bg-primary-600 mr-3 rounded"></span>
                            {category.category}
                        </h2>
                        <div className="space-y-4">
                            {category.questions.map((faq) => {
                                const currentIndex = globalIndex++;
                                return (
                                    <div
                                        key={currentIndex}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(currentIndex)}
                                            className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <span className="font-semibold text-gray-900 pr-4">
                                                {faq.q}
                                            </span>
                                            <svg
                                                className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${openIndex === currentIndex ? 'rotate-180' : ''
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                        <div
                                            className={`transition-all duration-300 ease-in-out ${openIndex === currentIndex
                                                    ? 'max-h-96 opacity-100'
                                                    : 'max-h-0 opacity-0'
                                                } overflow-hidden`}
                                        >
                                            <div className="px-6 pb-4 text-gray-600">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </section>

            {/* Still Have Questions */}
            <section className="bg-white border-t py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        Our team is here to help! Contact us for personalized assistance.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
                    >
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    );
}
