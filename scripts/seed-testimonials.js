require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Simple schema definition for script
const testimonialSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    avatarUrl: String,
    customerName: String,
    company: String,
    text: String,
    image: String,
    rating: Number,
    featured: Boolean,
    approved: Boolean,
    createdAt: Date,
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

const sampleTestimonials = [
    {
        name: 'Priya Patel',
        email: 'priya@cricketclub.com',
        message: 'Outstanding quality and fast delivery! The jerseys for our women cricket team are perfect. The fabric is breathable and the printing is top-notch.',
        rating: 5,
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        approved: true,
        featured: true,
        createdAt: new Date('2024-10-15'),
    },
    {
        name: 'Amit Kumar',
        company: 'Delhi Football Academy',
        message: 'We have been ordering from Believe India for 3 years now. Consistently excellent products and customer service. Highly recommended!',
        rating: 5,
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        approved: true,
        createdAt: new Date('2024-11-01'),
    },
    {
        name: 'Sneha Reddy',
        company: 'Bangalore Basketball Club',
        message: 'The custom jerseys exceeded our expectations. Great fit, vibrant colors, and durable material. Our team looks professional!',
        rating: 5,
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
        approved: true,
        createdAt: new Date('2024-11-10'),
    },
    {
        customerName: 'Rajesh Sharma',
        company: 'Mumbai Volleyball Association',
        text: 'Quality sportswear at affordable prices. The team was very helpful in customizing our order. Will definitely order again!',
        rating: 4,
        approved: true,
        createdAt: new Date('2024-11-15'),
    },
    {
        name: 'Kavya Singh',
        email: 'kavya@sportsindia.com',
        message: 'Best sportswear supplier in India! Quick turnaround time and premium quality materials. Our athletics team is very happy.',
        rating: 5,
        avatarUrl: 'https://i.pravatar.cc/150?img=20',
        approved: true,
        createdAt: new Date('2024-11-20'),
    },
    {
        name: 'Arjun Mehta',
        company: 'Pune Badminton Club',
        message: 'Impressed with the attention to detail and quality. The custom embroidery looks fantastic. Great work, Believe India!',
        rating: 5,
        approved: true,
        createdAt: new Date('2024-11-25'),
    },
];

async function seedTestimonials() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully!');

        console.log('Clearing existing approved testimonials...');
        await Testimonial.deleteMany({ approved: true });

        console.log('Adding sample testimonials...');
        const results = await Testimonial.insertMany(sampleTestimonials);
        console.log(`Successfully added ${results.length} testimonials!`);

        console.log('\nSample testimonials:');
        results.forEach((t, index) => {
            console.log(`${index + 1}. ${t.name || t.customerName} - Rating: ${t.rating}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding testimonials:', error);
        process.exit(1);
    }
}

seedTestimonials();
