import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '../../../../models/User';
import connectDB from '../../../../lib/db';
import { sendVerificationEmail } from '../../../../lib/email';


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                // Check if email is verified
                // IMPORTANT: Only require verification for NEW users who have a verificationToken
                // Existing users (created before verification system) don't have verificationToken
                // and should be allowed to login
                if (!user.isVerified && user.verificationToken) {
                    // Check if verification token has expired
                    const isTokenExpired = user.verificationTokenExpiry && new Date(user.verificationTokenExpiry) < new Date();

                    if (isTokenExpired) {
                        // Token expired - generate new token and resend email
                        const newToken = user.generateVerificationToken();
                        await user.save();

                        const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${newToken}`;

                        try {
                            await sendVerificationEmail(user.email, user.name, verificationUrl);
                        } catch (emailError) {
                            console.error('Failed to send verification email:', emailError);
                        }

                        throw new Error('Your verification link has expired. A new verification email has been sent to you. Please check your inbox.');
                    } else {
                        // Token still valid - ask user to verify
                        throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
                    }
                }

                // Auto-verify existing users (backward compatibility)
                if (!user.isVerified && !user.verificationToken) {
                    // This is an existing user from before verification system was added
                    user.isVerified = true;
                    await user.save();
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login', // Unified login page
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
