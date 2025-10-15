const Imap = require('imap');
const { simpleParser } = require('mailparser');
const fs = require('fs-extra');
const path = require('path');

class ImapService {
  constructor() {
    this.imap = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      this.imap = new Imap({
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST || 'imap.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 993,
        tls: process.env.EMAIL_TLS === 'true',
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 30000, // 30 seconds connection timeout
        authTimeout: 30000, // 30 seconds auth timeout
        keepalive: true
      });

      console.log('IMAP client initialized');
    } catch (error) {
      console.error('Error initializing IMAP client:', error.message);
    }
  }

  // Connect to IMAP server
  connect() {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        console.log('IMAP connection ready');
        resolve();
      });

      this.imap.once('error', (err) => {
        console.error('IMAP connection error:', err);
        reject(err);
      });

      this.imap.connect();
    });
  }

  // Disconnect from IMAP server
  disconnect() {
    if (this.imap && this.imap.state !== 'disconnected') {
      this.imap.end();
    }
  }

  // Open mailbox
  openMailbox(boxName = 'INBOX') {
    return new Promise((resolve, reject) => {
      this.imap.openBox(boxName, false, (err, box) => {
        if (err) {
          reject(err);
        } else {
          resolve(box);
        }
      });
    });
  }

  // Search for unread emails with attachments from specific sender
  searchUnreadWithAttachments() {
    return new Promise((resolve, reject) => {
      // Fetch emails from October 1, 2025 onwards
      const startDate = new Date('2025-10-01');
      
      // Search for unread emails from ABHICL.MIS@adityabirlahealth.com since Oct 1, 2025
      this.imap.search([
        'UNSEEN',
        ['FROM', 'ABHICL.MIS@adityabirlahealth.com'],
        ['SINCE', startDate.toDateString()]
      ], (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Found ${results ? results.length : 0} unread emails from ABHICL.MIS@adityabirlahealth.com since ${startDate.toDateString()}`);
          resolve(results || []);
        }
      });
    });
  }

  // Fetch email details and attachments
  fetchEmails(messageIds) {
    return new Promise((resolve, reject) => {
      if (!messageIds || messageIds.length === 0) {
        return resolve([]);
      }

      const emails = [];
      const parsePromises = [];
      
      const fetch = this.imap.fetch(messageIds, {
        bodies: '',
        struct: true
      });

      fetch.on('message', (msg, seqno) => {
        const emailPromise = new Promise((resolveEmail) => {
          const emailData = {
            seqno,
            attachments: []
          };

          msg.on('body', (stream) => {
            let buffer = '';

            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });

            stream.once('end', () => {
              simpleParser(buffer, async (err, parsed) => {
                if (err) {
                  console.error('Error parsing email:', err);
                  resolveEmail(null);
                  return;
                }

                emailData.subject = parsed.subject;
                emailData.from = parsed.from ? parsed.from.text : '';
                emailData.date = parsed.date;

                // Check for Excel attachments
                if (parsed.attachments && parsed.attachments.length > 0) {
                  for (const attachment of parsed.attachments) {
                    // Skip if filename is undefined or null
                    if (!attachment.filename) {
                      continue;
                    }
                    
                    const ext = path.extname(attachment.filename).toLowerCase();
                    if (ext === '.xlsx' || ext === '.xls') {
                      emailData.attachments.push({
                        filename: attachment.filename,
                        content: attachment.content,
                        contentType: attachment.contentType
                      });
                    }
                  }
                }

                resolveEmail(emailData);
              });
            });
          });
        });

        parsePromises.push(emailPromise);
      });

      fetch.once('error', (err) => {
        reject(err);
      });

      fetch.once('end', async () => {
        // Wait for all emails to be parsed
        const parsedEmails = await Promise.all(parsePromises);
        // Filter out null values (failed parses)
        const validEmails = parsedEmails.filter(email => email !== null);
        resolve(validEmails);
      });
    });
  }

  // Mark emails as read
  markAsRead(messageIds) {
    return new Promise((resolve, reject) => {
      if (!messageIds || messageIds.length === 0) {
        return resolve();
      }

      this.imap.addFlags(messageIds, ['\\Seen'], (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Marked ${messageIds.length} emails as read`);
          resolve();
        }
      });
    });
  }

  // Download attachment to file
  async saveAttachment(attachment, uploadFolder) {
    try {
      await fs.ensureDir(uploadFolder);
      
      // Generate unique filename to avoid collisions
      const timestamp = Date.now();
      const ext = path.extname(attachment.filename);
      const basename = path.basename(attachment.filename, ext);
      const uniqueFilename = `${basename}_${timestamp}${ext}`;
      
      const filePath = path.join(uploadFolder, uniqueFilename);
      await fs.writeFile(filePath, attachment.content);
      console.log(`Saved attachment: ${uniqueFilename}`);
      return filePath;
    } catch (error) {
      console.error(`Error saving attachment ${attachment.filename}:`, error.message);
      throw error;
    }
  }

  // Process all unread emails with Excel attachments
  async processUnreadEmails(uploadFolder) {
    try {
      console.log('Connecting to email server...');
      await this.connect();

      console.log('Opening mailbox...');
      await this.openMailbox();

      console.log('Searching for unread emails...');
      const messageIds = await this.searchUnreadWithAttachments();

      if (messageIds.length === 0) {
        console.log('No unread emails found');
        this.disconnect();
        return [];
      }

      console.log(`Found ${messageIds.length} unread emails`);

      // Limit to process only 20 emails at a time to avoid crashes
      const BATCH_SIZE = 20;
      const limitedMessageIds = messageIds.slice(0, BATCH_SIZE);
      
      if (messageIds.length > BATCH_SIZE) {
        console.log(`Processing first ${BATCH_SIZE} emails (${messageIds.length - BATCH_SIZE} remaining)`);
      }

      console.log('Fetching email details...');
      const emails = await this.fetchEmails(limitedMessageIds);

      const downloadedFiles = [];

      // Save all attachments first
      for (const email of emails) {
        if (email.attachments && email.attachments.length > 0) {
          console.log(`Processing email: ${email.subject}`);

          for (const attachment of email.attachments) {
            try {
              const filePath = await this.saveAttachment(attachment, uploadFolder);
              
              // Verify file exists before adding to list
              if (await fs.pathExists(filePath)) {
                downloadedFiles.push({
                  filePath,
                  filename: attachment.filename,
                  seqno: email.seqno,
                  subject: email.subject,
                  from: email.from,
                  date: email.date
                });
                console.log(`✅ Saved and verified: ${attachment.filename}`);
              } else {
                console.error(`❌ File not found after save: ${filePath}`);
              }
            } catch (error) {
              console.error(`Failed to save ${attachment.filename}:`, error.message);
            }
          }
        }
      }

      console.log(`\nTotal files downloaded: ${downloadedFiles.length}`);

      // Mark processed emails as read ONLY if files were successfully downloaded
      if (downloadedFiles.length > 0) {
        const processedSeqnos = [...new Set(downloadedFiles.map(f => f.seqno))];
        await this.markAsRead(processedSeqnos);
      }

      this.disconnect();
      return downloadedFiles;
    } catch (error) {
      console.error('Error processing emails:', error.message);
      this.disconnect();
      throw error;
    }
  }
}

module.exports = new ImapService();
