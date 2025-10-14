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

  // Bulk upsert customers
  async bulkUpsertCustomers(customersData) {
    const results = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: []
    };

    for (const customerData of customersData) {
      try {
        const result = await this.upsertCustomer(customerData);
        if (result.action === 'created') {
          results.created++;
        } else if (result.action === 'updated') {
          results.updated++;
        } else {
          results.unchanged++;
        }
      } catch (error) {
        results.errors.push({
          proposalNo: customerData.proposalNo,
          error: error.message
        });
      }
    }

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
        query.$or = [
          { proposalNumber: { $regex: filters.search, $options: 'i' } },
          { proposerName: { $regex: filters.search, $options: 'i' } },
          { intermediaryName: { $regex: filters.search, $options: 'i' } }
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
        .select('-history'); // Exclude history for list view

      const total = await Customer.countDocuments(query);

      return {
        customers,
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

  // Get customer by proposal number with full history
  async getCustomerByProposalNo(proposalNumber) {
    try {
      const customer = await Customer.findOne({ proposalNumber });
      if (!customer) {
        throw new Error(`Customer with Proposal Number ${proposalNumber} not found`);
      }
      return customer;
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
      ]);

      const recentCustomers = await Customer.find()
        .sort({ lastUpdated: -1 })
        .limit(10)
        .select('-history');

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
        .limit(limit);
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
}

module.exports = new DatabaseService();
