'use client';

import { useState, useEffect } from 'react';

/**
 * Password Strength Meter Component
 * Displays real-time password strength feedback
 * 
 * @param {string} password - Password to evaluate
 * @param {boolean} showMeter - Whether to show the meter
 */
export default function PasswordStrengthMeter({ password, showMeter = true }) {
    const [strength, setStrength] = useState({ level: 0, text: '', color: '', hints: [] });

    useEffect(() => {
        if (!password) {
            setStrength({ level: 0, text: '', color: '', hints: [] });
            return;
        }

        const calculateStrength = (pwd) => {
            let score = 0;
            const hints = [];

            // Length check
            if (pwd.length >= 8) {
                score += 1;
            } else {
                hints.push('Use at least 8 characters');
            }

            if (pwd.length >= 12) {
                score += 1;
            }

            // Lowercase letters
            if (/[a-z]/.test(pwd)) {
                score += 1;
            } else {
                hints.push('Add lowercase letters');
            }

            // Uppercase letters
            if (/[A-Z]/.test(pwd)) {
                score += 1;
            } else {
                hints.push('Add uppercase letters');
            }

            // Numbers
            if (/\d/.test(pwd)) {
                score += 1;
            } else {
                hints.push('Add numbers');
            }

            // Special characters
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
                score += 1;
            } else {
                hints.push('Add special characters (!@#$%^&*)');
            }

            // Avoid common patterns
            const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111'];
            const hasCommonPattern = commonPatterns.some(pattern =>
                pwd.toLowerCase().includes(pattern)
            );
            if (hasCommonPattern) {
                score -= 2;
                hints.push('Avoid common patterns');
            }

            // Determine strength level
            let level, text, color;

            if (score <= 2) {
                level = 1;
                text = 'Weak';
                color = 'bg-red-500';
            } else if (score <= 4) {
                level = 2;
                text = 'Medium';
                color = 'bg-yellow-500';
            } else {
                level = 3;
                text = 'Strong';
                color = 'bg-green-500';
            }

            return { level, text, color, hints: hints.slice(0, 2) }; // Show max 2 hints
        };

        setStrength(calculateStrength(password));
    }, [password]);

    if (!showMeter || !password) {
        return null;
    }

    return (
        <div className="mt-2">
            {/* Strength Bar */}
            <div className="flex gap-1 mb-2">
                <div className={`h-2 flex-1 rounded ${strength.level >= 1 ? strength.color : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${strength.level >= 2 ? strength.color : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${strength.level >= 3 ? strength.color : 'bg-gray-200'}`}></div>
            </div>

            {/* Strength Text */}
            <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${strength.level === 1 ? 'text-red-600' :
                        strength.level === 2 ? 'text-yellow-600' :
                            'text-green-600'
                    }`}>
                    Password Strength: {strength.text}
                </span>
            </div>

            {/* Hints */}
            {strength.hints.length > 0 && (
                <div className="mt-1">
                    {strength.hints.map((hint, index) => (
                        <p key={index} className="text-xs text-gray-500">
                            • {hint}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
