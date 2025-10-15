const databaseService = require('../services/databaseService');
const excelService = require('../services/excelService');
const path = require('path');

class CustomerController {
  // Get all customers
  async getAllCustomers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const filters = {
        policyStatus: req.query.policyStatus,
        search: req.query.search,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      };

      const result = await databaseService.getAllCustomers(page, limit, filters);
      
      res.json({
        success: true,
        data: {
          customers: result.customers,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        error: error.message
      });
    }
  }

  // Get customer by proposal number
  async getCustomerByProposalNo(req, res) {
    try {
      const { proposalNumber } = req.params;
      const customer = await databaseService.getCustomerByProposalNo(proposalNumber);

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Error in getCustomerByProposalNo:', error);
      res.status(404).json({
        success: false,
        message: 'Customer not found',
        error: error.message
      });
    }
  }

  // Upload and process Excel file manually
  async uploadExcel(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const filePath = req.file.path;
      console.log(`Processing uploaded file: ${filePath}`);

      // Extract data from Excel
      const customerData = excelService.extractCustomerData(filePath);

      // Bulk upsert to database
      const results = await databaseService.bulkUpsertCustomers(customerData);

      // Delete the uploaded file
      await excelService.deleteFile(filePath);

      res.json({
        success: true,
        message: 'File processed successfully',
        data: {
          totalRecords: customerData.length,
          created: results.created,
          updated: results.updated,
          unchanged: results.unchanged,
          errors: results.errors
        }
      });
    } catch (error) {
      console.error('Error in uploadExcel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process Excel file',
        error: error.message
      });
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const stats = await databaseService.getDashboardStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard stats',
        error: error.message
      });
    }
  }

  // Export all customers to Excel
  async exportCustomers(req, res) {
    try {
      const customers = await databaseService.exportAllCustomers();
      
      // Convert to plain objects
      const data = customers.map(c => ({
        ProposalNo: c.proposalNo,
        CustomerName: c.customerName,
        Status: c.status,
        Remarks: c.remarks,
        Date: c.date,
        LastUpdated: c.lastUpdated
      }));

      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const filename = `customers_export_${timestamp}.xlsx`;
      const outputPath = path.join(process.env.UPLOAD_FOLDER || './uploads', filename);

      excelService.exportToExcel(data, outputPath);

      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Delete file after download
        excelService.deleteFile(outputPath);
      });
    } catch (error) {
      console.error('Error in exportCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export customers',
        error: error.message
      });
    }
  }

  // Get sync history
  async getSyncHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const syncLogs = await databaseService.getSyncHistory(limit);

      res.json({
        success: true,
        data: syncLogs
      });
    } catch (error) {
      console.error('Error in getSyncHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sync history',
        error: error.message
      });
    }
  }

  // Get duplicate analysis
  async getDuplicateAnalysis(req, res) {
    try {
      const analysis = await databaseService.getDuplicateAnalysis();

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error in getDuplicateAnalysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch duplicate analysis',
        error: error.message
      });
    }
  }
}

module.exports = new CustomerController();
