const cron = require('node-cron');
const imapService = require('../services/imapService');
const excelService = require('../services/excelService');
const databaseService = require('../services/databaseService');

class CronJobs {
  constructor() {
    this.isRunning = false;
  }

  // Email sync job
  async syncEmailsJob() {
    if (this.isRunning) {
      console.log('Previous sync still running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log(`[CRON] Starting email sync at ${new Date().toISOString()}`);

    try {
      const uploadFolder = process.env.UPLOAD_FOLDER || './uploads';
      
      // Fetch and download emails
      const downloadedFiles = await imapService.processUnreadEmails(uploadFolder);

      if (downloadedFiles.length === 0) {
        console.log('[CRON] No new emails with Excel attachments');
        this.isRunning = false;
        return;
      }

      let created = 0;
      let updated = 0;
      let unchanged = 0;
      const errors = [];
      const filesProcessed = [];

      // Process each downloaded file
      for (const fileInfo of downloadedFiles) {
        try {
          console.log(`[CRON] Processing: ${fileInfo.filename}`);

          // Extract data
          const customerData = excelService.extractCustomerData(fileInfo.filePath);

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

          console.log(`[CRON] Processed ${fileInfo.filename}: ${results.created} created, ${results.updated} updated`);
        } catch (error) {
          console.error(`[CRON] Error processing ${fileInfo.filename}:`, error.message);
          errors.push({
            file: fileInfo.filename,
            error: error.message
          });
        }
      }

      // Create sync log
      await databaseService.createSyncLog({
        emailsProcessed: downloadedFiles.length,
        recordsCreated: created,
        recordsUpdated: updated,
        status: errors.length === 0 ? 'success' : 'partial',
        errors,
        filesProcessed
      });

      console.log(`[CRON] Sync completed: ${created} created, ${updated} updated, ${unchanged} unchanged`);
    } catch (error) {
      console.error('[CRON] Sync job failed:', error.message);
      
      // Log failed sync
      await databaseService.createSyncLog({
        emailsProcessed: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        status: 'failed',
        errors: [{ error: error.message }],
        filesProcessed: []
      });
    } finally {
      this.isRunning = false;
    }
  }

  // Start all cron jobs
  start() {
    const schedule = process.env.CRON_SCHEDULE || '*/5 * * * *'; // Default: every 5 minutes
    
    console.log(`Starting cron job with schedule: ${schedule}`);
    
    // Schedule email sync job
    cron.schedule(schedule, () => {
      this.syncEmailsJob();
    });

    console.log('Cron jobs started successfully');
  }
}

module.exports = new CronJobs();
