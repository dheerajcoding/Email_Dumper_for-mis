require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ Connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    
    // Check collection name
    console.log('Collection name:', Customer.collection.name);
    
    // Count existing documents
    const count = await Customer.countDocuments();
    console.log('Current documents in collection:', count);
    
    // List collections in database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Show sample document if any exist
    if (count > 0) {
      console.log('\nSample document:');
      const sample = await Customer.findOne();
      console.log(JSON.stringify(sample, null, 2));
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
