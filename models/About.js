import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    companyName: {
        type: String,
        default: 'Believe India Sportswear',
    },
    description: {
        type: String,
        default: 'We are a leading manufacturer of premium sportswear and athletic apparel.',
    },
    ownerImage: {
        type: String,
        default: '',
    },
    instagram: {
        type: String,
        default: '',
    },
    instagramLink: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: 'India',
    },
    contactPerson: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.About || mongoose.model('About', aboutSchema);
