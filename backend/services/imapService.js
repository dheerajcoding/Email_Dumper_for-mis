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
        tlsOptions: { rejectUnauthorized: false }
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

  // Search for unread emails with attachments
  searchUnreadWithAttachments() {
    return new Promise((resolve, reject) => {
      this.imap.search(['UNSEEN'], (err, results) => {
        if (err) {
          reject(err);
        } else {
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
      const fetch = this.imap.fetch(messageIds, {
        bodies: '',
        struct: true
      });

      fetch.on('message', (msg, seqno) => {
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

              emails.push(emailData);
            });
          });
        });
      });

      fetch.once('error', (err) => {
        reject(err);
      });

      fetch.once('end', () => {
        // Wait a bit for all parsing to complete
        setTimeout(() => {
          resolve(emails);
        }, 1000);
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
      const filePath = path.join(uploadFolder, attachment.filename);
      await fs.writeFile(filePath, attachment.content);
      console.log(`Saved attachment: ${attachment.filename}`);
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

      console.log('Fetching email details...');
      const emails = await this.fetchEmails(messageIds);

      const downloadedFiles = [];

      for (const email of emails) {
        if (email.attachments && email.attachments.length > 0) {
          console.log(`Processing email: ${email.subject}`);

          for (const attachment of email.attachments) {
            try {
              const filePath = await this.saveAttachment(attachment, uploadFolder);
              downloadedFiles.push({
                filePath,
                filename: attachment.filename,
                seqno: email.seqno,
                subject: email.subject,
                from: email.from,
                date: email.date
              });
            } catch (error) {
              console.error(`Failed to save ${attachment.filename}:`, error.message);
            }
          }
        }
      }

      // Mark processed emails as read
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
