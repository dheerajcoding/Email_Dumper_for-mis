const Customer = require('../models/Customer');
const SyncLog = require('../models/SyncLog');

class DatabaseService {
  // Create or update customer record with version history
  async upsertCustomer(customerData) {
    try {
      const { proposalNumber } = customerData;

      // Find existing customer
      const existingCustomer = await Customer.findOne({ proposalNumber });

      if (existingCustomer) {
        // Customer exists - update with history tracking
        const oldData = existingCustomer.toObject();
        delete oldData._id;
        delete oldData.__v;
        delete oldData.history;
        delete oldData.createdAt;
        delete oldData.updatedAt;

        // Check if data actually changed
        const hasChanged = JSON.stringify(oldData) !== JSON.stringify({
          ...oldData,
          ...customerData,
          lastUpdated: oldData.lastUpdated
        });

        if (hasChanged) {
          // Add old data to history
          existingCustomer.history.push({
            updatedAt: new Date(),
            changes: oldData
          });

          // Update with new data
          Object.assign(existingCustomer, customerData);
          existingCustomer.lastUpdated = new Date();

          await existingCustomer.save();
          console.log(`Updated customer: ${proposalNumber}`);
          return { customer: existingCustomer, action: 'updated' };
        } else {
          console.log(`No changes for customer: ${proposalNumber}`);
          return { customer: existingCustomer, action: 'unchanged' };
        }
      } else {
        // Create new customer
        const newCustomer = new Customer({
          ...customerData,
          lastUpdated: new Date(),
          history: []
        });

        await newCustomer.save();
        console.log(`Created new customer: ${proposalNumber}`);
        return { customer: newCustomer, action: 'created' };
      }
    } catch (error) {
      console.error('Error upserting customer:', error.message);
      throw error;
    }
  }

  // Bulk upsert customers (optimized for large batches)
  async bulkUpsertCustomers(customersData) {
    const results = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: []
    };

    console.log(`Starting bulk upsert of ${customersData.length} records...`);

    // Process in smaller batches to avoid timeouts
    const BATCH_SIZE = 100;
    const batches = [];
    for (let i = 0; i < customersData.length; i += BATCH_SIZE) {
      batches.push(customersData.slice(i, i + BATCH_SIZE));
    }

    console.log(`Processing ${batches.length} batches of ${BATCH_SIZE} records each...`);

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`Processing batch ${batchIndex + 1}/${batches.length}...`);

      const bulkOps = batch.map(customerData => ({
        updateOne: {
          filter: { proposalNumber: customerData.proposalNumber },
          update: {
            $set: {
              ...customerData,
              lastUpdated: new Date()
            },
            $setOnInsert: {
              createdAt: new Date(),
              history: []
            },
            $inc: { updateCount: 1 } // Track how many times this lead was updated
          },
          upsert: true
        }
      }));

      try {
        const result = await Customer.bulkWrite(bulkOps, { ordered: false });
        results.created += result.upsertedCount || 0;
        results.updated += result.modifiedCount || 0;
        results.unchanged += (batch.length - (result.upsertedCount || 0) - (result.modifiedCount || 0));
        
        console.log(`Batch ${batchIndex + 1} completed: Created ${result.upsertedCount || 0}, Updated ${result.modifiedCount || 0}`);
      } catch (error) {
        console.error(`Error in batch ${batchIndex + 1}:`, error.message);
        results.errors.push({
          batch: batchIndex + 1,
          error: error.message
        });
      }
    }

    console.log(`Bulk upsert completed: Created ${results.created}, Updated ${results.updated}, Unchanged ${results.unchanged}`);
    return results;
  }

  // Bulk INSERT customers with ALL duplicates (no upsert, track all versions)
  async bulkInsertAllCustomers(customersData) {
    const results = {
      created: 0,
      duplicates: 0,
      errors: []
    };

    console.log(`Starting bulk INSERT of ${customersData.length} records (including duplicates)...`);

    // IMPORTANT: Group data by proposal number to track duplicates WITHIN this batch
    const proposalGroups = {};
    customersData.forEach(data => {
      const propNo = data.proposalNumber;
      if (!proposalGroups[propNo]) {
        proposalGroups[propNo] = [];
      }
      proposalGroups[propNo].push(data);
    });

    const uniqueProposals = Object.keys(proposalGroups).length;
    const duplicatesInBatch = customersData.length - uniqueProposals;
    
    if (duplicatesInBatch > 0) {
      console.log(`📊 Found ${duplicatesInBatch} duplicates within this batch (${uniqueProposals} unique proposals, ${customersData.length} total records)`);
    }

    // Collect ALL records to insert with proper version tracking
    const allRecordsToInsert = [];

    // Process each proposal group
    for (const [proposalNumber, records] of Object.entries(proposalGroups)) {
      // Count how many of this proposal already exist in database
      const existingCount = await Customer.countDocuments({ proposalNumber });
      
      if (records.length > 1) {
        console.log(`  🔄 Proposal ${proposalNumber} appears ${records.length} times in this batch (already have ${existingCount} in DB)`);
      }

      // Add version tracking to each record in the group
      records.forEach((customerData, index) => {
        const versionNumber = existingCount + index + 1;
        const isDup = (existingCount + index) > 0;
        
        allRecordsToInsert.push({
          ...customerData,
          updateCount: versionNumber,
          isDuplicate: isDup,
          importedAt: new Date(),
          createdAt: new Date(),
          lastUpdated: new Date(),
          history: []
        });

        if (isDup) {
          results.duplicates++;
          console.log(`    ➜ Version ${versionNumber} (${isDup ? '🔄 Duplicate' : '✨ New'})`);
        }
      });
    }

    console.log(`\n📦 Inserting ${allRecordsToInsert.length} records (${results.duplicates} marked as duplicates)...`);

    // Insert in batches to avoid timeouts
    const BATCH_SIZE = 100;
    for (let i = 0; i < allRecordsToInsert.length; i += BATCH_SIZE) {
      const batch = allRecordsToInsert.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allRecordsToInsert.length / BATCH_SIZE);
      
      try {
        console.log(`  ⏳ Inserting batch ${batchNum}/${totalBatches} (${batch.length} records)...`);
        const inserted = await Customer.insertMany(batch, { ordered: false });
        results.created += inserted.length;
        console.log(`  ✅ Batch ${batchNum} inserted successfully`);
      } catch (error) {
        console.error(`  ❌ Error in batch ${batchNum}:`, error.message);
        results.errors.push({
          batch: batchNum,
          error: error.message
        });
      }
    }

    console.log(`\n✅ Bulk insert completed:`);
    console.log(`   📊 Total inserted: ${results.created} records`);
    console.log(`   🔄 Duplicates: ${results.duplicates}`);
    console.log(`   ✨ New: ${results.created - results.duplicates}`);
    
    return results;
  }

  // Get all customers with pagination
  async getAllCustomers(page = 1, limit = 50, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      // Apply filters
      if (filters.policyStatus) {
        query.policyStatus = filters.policyStatus;
      }
      if (filters.search) {
        // Enhanced multi-field search - searches across ALL relevant fields
        query.$or = [
          { proposalNumber: { $regex: filters.search, $options: 'i' } },
          { proposerCode: { $regex: filters.search, $options: 'i' } },
          { proposerName: { $regex: filters.search, $options: 'i' } },
          { policyStatus: { $regex: filters.search, $options: 'i' } },
          { subStatus: { $regex: filters.search, $options: 'i' } },
          { productName: { $regex: filters.search, $options: 'i' } },
          { branchCode: { $regex: filters.search, $options: 'i' } },
          { channel: { $regex: filters.search, $options: 'i' } },
          { intermediaryCode: { $regex: filters.search, $options: 'i' } },
          { intermediaryName: { $regex: filters.search, $options: 'i' } },
          { salesManagerCode: { $regex: filters.search, $options: 'i' } },
          { salesManagerName: { $regex: filters.search, $options: 'i' } },
          { latestTeamName: { $regex: filters.search, $options: 'i' } },
          { sourceCode: { $regex: filters.search, $options: 'i' } },
          { businessType: { $regex: filters.search, $options: 'i' } },
          { discrepancyRemark: { $regex: filters.search, $options: 'i' } }
        ];
      }
      if (filters.dateFrom || filters.dateTo) {
        query.createdDate = {};
        if (filters.dateFrom) query.createdDate.$gte = filters.dateFrom;
        if (filters.dateTo) query.createdDate.$lte = filters.dateTo;
      }

      const customers = await Customer.find(query)
        .sort({ lastUpdated: -1 })
        .skip(skip)
        .limit(limit)
        .select('-history') // Exclude history for list view
        .allowDiskUse(true); // Allow disk usage for large sorts

      const total = await Customer.countDocuments(query);

      return {
        customers: customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting customers:', error.message);
      throw error;
    }
  }

  // Get customer by proposal number with full history (returns ALL versions)
  async getCustomerByProposalNo(proposalNumber) {
    try {
      // Find ALL records with this proposal number (including duplicates)
      const customers = await Customer.find({ proposalNumber })
        .sort({ updateCount: 1 }) // Sort by version number (1, 2, 3...)
        .allowDiskUse(true);
        
      if (!customers || customers.length === 0) {
        throw new Error(`Customer with Proposal Number ${proposalNumber} not found`);
      }
      
      // Return all versions if multiple exist, otherwise return single customer
      return customers.length === 1 ? customers[0] : customers;
    } catch (error) {
      console.error('Error getting customer:', error.message);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const totalCustomers = await Customer.countDocuments();
      const statusCounts = await Customer.aggregate([
        {
          $group: {
            _id: '$policyStatus',
            count: { $sum: 1 }
          }
        }
      ]).allowDiskUse(true); // Allow disk usage for large aggregations

      const recentCustomers = await Customer.find()
        .sort({ lastUpdated: -1 })
        .limit(50)
        .select('-history')
        .allowDiskUse(true); // Allow disk usage for large sorts

      const lastSync = await SyncLog.findOne()
        .sort({ syncTime: -1 });

      return {
        totalCustomers,
        statusCounts,
        recentCustomers,
        lastSync
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error.message);
      throw error;
    }
  }

  // Create sync log
  async createSyncLog(syncData) {
    try {
      const syncLog = new SyncLog(syncData);
      await syncLog.save();
      return syncLog;
    } catch (error) {
      console.error('Error creating sync log:', error.message);
      throw error;
    }
  }

  // Get sync history
  async getSyncHistory(limit = 20) {
    try {
      const syncLogs = await SyncLog.find()
        .sort({ syncTime: -1 })
        .limit(limit)
        .allowDiskUse(true); // Allow disk usage for large sorts
      return syncLogs;
    } catch (error) {
      console.error('Error getting sync history:', error.message);
      throw error;
    }
  }

  // Export all customers
  async exportAllCustomers() {
    try {
      const customers = await Customer.find().select('-_id -__v -history');
      return customers;
    } catch (error) {
      console.error('Error exporting customers:', error.message);
      throw error;
    }
  }

  // Get duplicate analysis - show how many times each lead was updated
  async getDuplicateAnalysis() {
    try {
      // Aggregate to find proposal numbers with multiple entries
      const duplicates = await Customer.aggregate([
        {
          $group: {
            _id: '$proposalNumber',
            count: { $sum: 1 },
            versions: {
              $push: {
                id: '$_id',
                updateCount: '$updateCount',
                importedAt: '$importedAt',
                policyStatus: '$policyStatus',
                subStatus: '$subStatus',
                proposerName: '$proposerName',
                lastUpdated: '$lastUpdated'
              }
            }
          }
        },
        {
          $match: {
            count: { $gt: 1 } // Only show proposals with more than 1 entry
          }
        },
        {
          $sort: { count: -1 } // Sort by most duplicates first
        }
      ]).allowDiskUse(true); // Allow disk usage for large aggregations

      const totalDuplicates = duplicates.length;
      const totalDuplicateRecords = duplicates.reduce((sum, item) => sum + item.count, 0);

      return {
        totalUniqueleadsWithDuplicates: totalDuplicates,
        totalDuplicateRecords,
        duplicates
      };
    } catch (error) {
      console.error('Error getting duplicate analysis:', error.message);
      throw error;
    }
  }
}

module.exports = new DatabaseService();
