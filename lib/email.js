import nodemailer from 'nodemailer';

/**
 * Send contact form email to production team
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} - Result of email sending
 */
export async function sendContactEmail(formData) {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email HTML template
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        background: white;
                        padding: 30px;
                        border-radius: 0 0 5px 5px;
                    }
                    .field {
                        margin-bottom: 20px;
                    }
                    .label {
                        font-weight: bold;
                        color: #667eea;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .value {
                        color: #333;
                        padding: 10px;
                        background-color: #f5f5f5;
                        border-left: 3px solid #667eea;
                        border-radius: 3px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Contact Form Submission</h1>
                        <p>Believe India Sportswear</p>
                    </div>
                    <div class="content">
                        <div class="field">
                            <span class="label">Name:</span>
                            <div class="value">${formData.name}</div>
                        </div>
                        <div class="field">
                            <span class="label">Email:</span>
                            <div class="value">${formData.email}</div>
                        </div>
                        ${formData.phone ? `
                        <div class="field">
                            <span class="label">Phone:</span>
                            <div class="value">${formData.phone}</div>
                        </div>
                        ` : ''}
                        <div class="field">
                            <span class="label">Subject:</span>
                            <div class="value">${formData.subject}</div>
                        </div>
                        <div class="field">
                            <span class="label">Message:</span>
                            <div class="value">${formData.message}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This email was sent from the contact form on Believe India Sportswear website</p>
                        <p>Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `New Contact Form: ${formData.subject}`,
            html: emailHtml,
            replyTo: formData.email,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (10 digits, accepts optional +91 prefix and spaces/hyphens)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid or empty
 */
export function isValidPhone(phone) {
    if (!phone || phone.trim() === '') return true; // Phone is optional

    // Remove spaces, hyphens, and +91 prefix
    const cleanPhone = phone.replace(/[\s\-+]/g, '').replace(/^91/, '');

    // Check if it's exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(cleanPhone);
}

/**
 * Send email verification link to new users
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @param {string} verificationUrl - Verification URL with token
 * @returns {Promise<Object>} - Result of email sending
 */
export async function sendVerificationEmail(email, name, verificationUrl) {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email HTML template
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        background: white;
                        padding: 30px;
                        border-radius: 0 0 5px 5px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 30px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                        font-weight: bold;
                    }
                    .warning {
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 3px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Believe India!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${name},</h2>
                        <p>Thank you for registering with Believe India Sportswear!</p>
                        <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                        
                        <div style="text-align: center;">
                            <a href="${verificationUrl}" class="button">Verify Email Address</a>
                        </div>
                        
                        <div class="warning">
                            <strong>⏰ Important:</strong> This verification link will expire in <strong>5 minutes</strong>. Please verify your email as soon as possible.
                        </div>
                        
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
                        
                        <p>If you didn't create an account with Believe India, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Believe India Sportswear. All rights reserved.</p>
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Email options
        const mailOptions = {
            from: `"Believe India Sportswear" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - Believe India',
            html: emailHtml,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}
