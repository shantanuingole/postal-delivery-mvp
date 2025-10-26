const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pincode = require('../models/Pincode');
const connectDB = require('../config/db');
const sampleData = require('./sample_data.json');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Delete all existing records
    await Pincode.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert sample data
    const inserted = await Pincode.insertMany(sampleData);
    console.log(`✅ Successfully inserted ${inserted.length} records!`);

    // Show sample records
    console.log('\n📊 Sample records:');
    inserted.slice(0, 3).forEach(record => {
      console.log(`   - ${record.officeName} (${record.pincode}), ${record.district}`);
    });

    console.log('\n✅ Database seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
