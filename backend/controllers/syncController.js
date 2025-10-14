const imapService = require('../services/imapService');
const excelService = require('../services/excelService');
const databaseService = require('../services/databaseService');
const path = require('path');

class SyncController {
  // Manually trigger Gmail sync
  async triggerSync(req, res) {
    try {
      console.log('Manual sync triggered');

      const uploadFolder = process.env.UPLOAD_FOLDER || './uploads';
      
      // Fetch and download emails
      const downloadedFiles = await imapService.processUnreadEmails(uploadFolder);

      let totalRecords = 0;
      let created = 0;
      let updated = 0;
      let unchanged = 0;
      const errors = [];
      const filesProcessed = [];

      // Process each downloaded file
      for (const fileInfo of downloadedFiles) {
        try {
          console.log(`Processing: ${fileInfo.filename}`);

          // Extract data
          const customerData = excelService.extractCustomerData(fileInfo.filePath);
          totalRecords += customerData.length;

          // Upsert to database
          const results = await databaseService.bulkUpsertCustomers(customerData);
          created += results.created;
          updated += results.updated;
          unchanged += results.unchanged;
          
          if (results.errors.length > 0) {
            errors.push(...results.errors);
          }

          filesProcessed.push(fileInfo.filename);

          // Delete file after processing
          await excelService.deleteFile(fileInfo.filePath);
        } catch (error) {
          console.error(`Error processing ${fileInfo.filename}:`, error.message);
          errors.push({
            file: fileInfo.filename,
            error: error.message
          });
        }
      }

      // Create sync log
      const syncLog = await databaseService.createSyncLog({
        emailsProcessed: downloadedFiles.length,
        recordsCreated: created,
        recordsUpdated: updated,
        status: errors.length === 0 ? 'success' : (filesProcessed.length > 0 ? 'partial' : 'failed'),
        errors,
        filesProcessed
      });

      res.json({
        success: true,
        message: 'Sync completed',
        data: {
          emailsProcessed: downloadedFiles.length,
          filesProcessed: filesProcessed.length,
          totalRecords,
          created,
          updated,
          unchanged,
          errors,
          syncTime: syncLog.syncTime
        }
      });
    } catch (error) {
      console.error('Error in triggerSync:', error);
      
      // Log failed sync
      await databaseService.createSyncLog({
        emailsProcessed: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        status: 'failed',
        errors: [{ error: error.message }],
        filesProcessed: []
      });

      res.status(500).json({
        success: false,
        message: 'Sync failed',
        error: error.message
      });
    }
  }

  // Test email connection
  async testConnection(req, res) {
    try {
      // Try to connect to email server
      await imapService.connect();
      imapService.disconnect();

      res.json({
        success: true,
        message: 'Email connection successful'
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      res.status(500).json({
        success: false,
        message: 'Email connection failed',
        error: error.message
      });
    }
  }
}

module.exports = new SyncController();
