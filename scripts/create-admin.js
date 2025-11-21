// Script to create first admin user
// Run with: node scripts/create-admin.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    role: String,
    createdAt: Date,
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        rl.question('Admin Email: ', async (email) => {
            rl.question('Admin Password: ', async (password) => {
                rl.question('Admin Name (default: Admin): ', async (name) => {
                    try {
                        // Check if user exists
                        const existing = await User.findOne({ email });
                        if (existing) {
                            console.log('\n❌ User with this email already exists!');
                            await mongoose.disconnect();
                            rl.close();
                            return;
                        }

                        // Hash password
                        const hashedPassword = await bcrypt.hash(password, 10);

                        // Create user
                        const user = await User.create({
                            email,
                            password: hashedPassword,
                            name: name || 'Admin',
                            role: 'admin',
                            createdAt: new Date(),
                        });

                        console.log('\n✅ Admin user created successfully!');
                        console.log('----------------------------');
                        console.log('Email:', user.email);
                        console.log('Name:', user.name);
                        console.log('Role:', user.role);
                        console.log('----------------------------\n');
                    } catch (error) {
                        console.error('\n❌ Error creating user:', error.message);
                    } finally {
                        await mongoose.disconnect();
                        rl.close();
                    }
                });
            });
        });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('\nMake sure:');
        console.log('1. MONGODB_URI is set in .env.local');
        console.log('2. Your MongoDB cluster is accessible');
        console.log('3. IP 0.0.0.0/0 is whitelisted in MongoDB Atlas');
        rl.close();
    }
}

createAdmin();
