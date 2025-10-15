const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function clearDatabase() {
  try {
    console.log('\n===========================================');
    console.log('📧 Email Dumper MIS - Database Reset Tool');
    console.log('===========================================\n');

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Import models
    const Customer = require('./models/Customer');
    const SyncLog = require('./models/SyncLog');

    // Count current records
    const customerCount = await Customer.countDocuments();
    const syncLogCount = await SyncLog.countDocuments();

    console.log('📊 Current Database Status:');
    console.log(`   - Customer Records: ${customerCount}`);
    console.log(`   - Sync Logs: ${syncLogCount}`);
    console.log('');

    // Warning message
    console.log('⚠️  WARNING: DATABASE RESET');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('This will permanently delete:');
    console.log(`   ❌ ${customerCount} customer records`);
    console.log(`   ❌ ${syncLogCount} sync log entries`);
    console.log('');
    console.log('After clearing, you can re-import emails with:');
    console.log('   ✅ Complete duplicate tracking');
    console.log('   ✅ All versions of each lead');
    console.log('   ✅ Full history with dates\n');

    // Ask for confirmation
    const answer = await new Promise((resolve) => {
      rl.question('Are you sure you want to continue? (yes/no): ', resolve);
    });

    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ Operation cancelled. No data was deleted.\n');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    console.log('\n🗑️  Clearing database in 3 seconds...');
    console.log('   Press Ctrl+C to cancel now!\n');
    
    // Countdown
    for (let i = 3; i > 0; i--) {
      process.stdout.write(`   ${i}... `);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n');

    // Delete all customer records
    console.log('🗑️  Deleting customer records...');
    const customerResult = await Customer.deleteMany({});
    console.log(`   ✅ Deleted ${customerResult.deletedCount} customer records`);

    // Delete all sync logs
    console.log('🗑️  Deleting sync logs...');
    const syncLogResult = await SyncLog.deleteMany({});
    console.log(`   ✅ Deleted ${syncLogResult.deletedCount} sync log entries`);

    // Verify deletion
    const remainingCustomers = await Customer.countDocuments();
    const remainingSyncLogs = await SyncLog.countDocuments();

    console.log('\n📊 Database Status After Clearing:');
    console.log(`   - Customer Records: ${remainingCustomers}`);
    console.log(`   - Sync Logs: ${remainingSyncLogs}`);

    if (remainingCustomers === 0 && remainingSyncLogs === 0) {
      console.log('\n✅ Database cleared successfully!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Next Steps:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('1️⃣  Go to Gmail (neerajkumar4@policybazaar.com)');
      console.log('    Search: from:ABHICL.MIS@adityabirlahealth.com after:2025/10/01');
      console.log('    → Select all emails');
      console.log('    → Click "Mark as unread" (⚠️ Important!)');
      console.log('');
      console.log('2️⃣  Go to Dashboard: http://localhost:3000');
      console.log('    → Click "🔄 Sync Now" button');
      console.log('    → Wait for sync to complete');
      console.log('');
      console.log('3️⃣  Check Results:');
      console.log('    → Go to "All Data" page');
      console.log('    → Look for Version 2, 3, 4... in Version column');
      console.log('    → Duplicates will show 🔄 badge');
      console.log('');
      console.log('4️⃣  Search for duplicate leads:');
      console.log('    → Search: QE0601895582509');
      console.log('    → You should see ALL versions with different dates');
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📝 Notes:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('✅ Each email will create a separate database record');
      console.log('✅ If proposal appears in 3 emails = 3 database records');
      console.log('✅ Version tracking: 1st email = Version 1, 2nd = Version 2, etc.');
      console.log('✅ Duplicate badge: 1st = ✨ New, 2nd+ = 🔄 Duplicate');
      console.log('✅ Search will show ALL versions of same proposal number');
      console.log('');
      console.log('⏱️  Auto-sync: Every 1 hour at :00 (9:00, 10:00, 11:00...)');
      console.log('');
    } else {
      console.log('\n⚠️  Warning: Some records may not have been deleted');
      console.log('   Please check manually or run the script again');
    }

    rl.close();
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');

  } catch (error) {
    console.error('\n❌ Error clearing database:', error.message);
    console.error(error.stack);
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Handle Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n\n❌ Operation cancelled by user');
  rl.close();
  await mongoose.disconnect();
  process.exit(0);
});

// Run the script
clearDatabase();
