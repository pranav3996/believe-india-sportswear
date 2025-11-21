import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    name: {
        type: String,
        default: 'Admin',
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
