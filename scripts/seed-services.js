import connectDB from '../lib/db.js';
import Service from '../models/Service.js';

/**
 * Seed Services Data
 * 
 * Populates the database with sample services for testing
 * Based on the data from data/services.js
 * 
 * Usage: 
 *   node --env-file=.env.local scripts/seed-services.js
 * Or for Node.js < 20.6:
 *   node -r dotenv/config scripts/seed-services.js dotenv_config_path=.env.local
 */

const sampleServices = [
    {
        title: 'Custom Design',
        description: 'Create unique sportswear with your team colors, logos, and designs. Our expert designers bring your vision to life.',
        icon: '🎨',
        category: 'design',
        featured: true,
        features: [
            'Logo placement',
            'Color customization',
            'Name & number printing',
            'Sublimation printing'
        ],
    },
    {
        title: 'Bulk Orders',
        description: 'Special pricing for team orders, clubs, schools, and corporate events. Minimum order quantities apply.',
        icon: '📦',
        category: 'ordering',
        featured: true,
        features: [
            'Competitive pricing',
            'Fast turnaround',
            'Quality assurance',
            'Dedicated support'
        ],
    },
    {
        title: 'Custom Sizing',
        description: 'Perfect fit for every athlete. We offer custom sizing options to ensure maximum comfort and performance.',
        icon: '✂️',
        category: 'customization',
        featured: false,
        features: [
            'Wide size range',
            'Custom measurements',
            'Youth to adult sizes',
            'Plus size options'
        ],
    },
    {
        title: 'Quality Assurance',
        description: 'Every product undergoes rigorous quality checks. We use premium fabrics and advanced manufacturing techniques.',
        icon: '🏆',
        category: 'quality',
        featured: true,
        features: [
            'Premium materials',
            'Durability testing',
            'Color fastness',
            'Quality certifications'
        ],
    },
    {
        title: 'Fast Delivery',
        description: 'Quick production and reliable shipping across India. Track your order from factory to doorstep.',
        icon: '🚚',
        category: 'delivery',
        featured: false,
        features: [
            'Pan-India shipping',
            'Order tracking',
            'Secure packaging',
            'Express options available'
        ],
    },
    {
        title: 'Consultation',
        description: 'Free consultation for design, fabric selection, and order planning. Our team helps you make informed decisions.',
        icon: '💬',
        category: 'support',
        featured: false,
        features: [
            'Design assistance',
            'Fabric samples',
            'Price quotes',
            'Expert guidance'
        ],
    },
];

async function seedServices() {
    try {
        console.log('🌱 Starting service seeding...\n');

        // Connect to database
        await connectDB();
        console.log('✅ Connected to MongoDB\n');

        // Check if services already exist
        const existingCount = await Service.countDocuments();

        if (existingCount > 0) {
            console.log(`⚠️  Found ${existingCount} existing services in database`);
            console.log('Would you like to:');
            console.log('1. Keep existing and add new (if different)');
            console.log('2. Delete all and re-seed');
            console.log('\nTo delete and re-seed, use: node scripts/seed-services.js --force\n');

            const forceFlag = process.argv.includes('--force');

            if (forceFlag) {
                await Service.deleteMany({});
                console.log('🗑️  Deleted all existing services\n');
            } else {
                console.log('ℹ️  Keeping existing services. Use --force to delete and re-seed.\n');
                process.exit(0);
            }
        }

        // Insert sample services
        console.log('📝 Inserting sample services...\n');

        const insertedServices = await Service.insertMany(sampleServices);

        console.log(`✅ Successfully seeded ${insertedServices.length} services:\n`);

        insertedServices.forEach((service, index) => {
            console.log(`${index + 1}. ${service.icon} ${service.title}`);
            console.log(`   Category: ${service.category} | Featured: ${service.featured ? 'Yes' : 'No'}`);
            console.log(`   ID: ${service._id}\n`);
        });

        console.log('🎉 Seeding completed successfully!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding services:', error);
        process.exit(1);
    }
}

// Run the seeder
seedServices();
