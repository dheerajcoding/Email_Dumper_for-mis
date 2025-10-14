const { google } = require('googleapis');
const fs = require('fs-extra');
const path = require('path');

class GmailService {
  constructor() {
    this.oauth2Client = null;
    this.gmail = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
      );

      // Set credentials if refresh token is available
      if (process.env.GMAIL_REFRESH_TOKEN) {
        this.oauth2Client.setCredentials({
          refresh_token: process.env.GMAIL_REFRESH_TOKEN
        });
        
        this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      }
    } catch (error) {
      console.error('Error initializing Gmail client:', error.message);
    }
  }

  // Generate OAuth URL for user authentication
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokenFromCode(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    return tokens;
  }

  // Fetch unread emails with Excel attachments
  async fetchEmailsWithExcelAttachments() {
    try {
      if (!this.gmail) {
        throw new Error('Gmail client not initialized. Please authenticate first.');
      }

      // Search for unread emails with Excel attachments
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread has:attachment (filename:xlsx OR filename:xls)',
        maxResults: 50
      });

      const messages = response.data.messages || [];
      console.log(`Found ${messages.length} unread emails with Excel attachments`);

      const emailsWithAttachments = [];

      for (const message of messages) {
        const email = await this.getEmailDetails(message.id);
        if (email && email.attachments.length > 0) {
          emailsWithAttachments.push(email);
        }
      }

      return emailsWithAttachments;
    } catch (error) {
      console.error('Error fetching emails:', error.message);
      throw error;
    }
  }

  // Get email details including attachments
  async getEmailDetails(messageId) {
    try {
      const message = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId
      });

      const headers = message.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      const attachments = [];

      // Check for attachments
      if (message.data.payload.parts) {
        for (const part of message.data.payload.parts) {
          if (part.filename && part.body.attachmentId) {
            const ext = path.extname(part.filename).toLowerCase();
            if (ext === '.xlsx' || ext === '.xls') {
              attachments.push({
                filename: part.filename,
                mimeType: part.mimeType,
                attachmentId: part.body.attachmentId
              });
            }
          }
        }
      }

      return {
        id: messageId,
        subject,
        from,
        date,
        attachments
      };
    } catch (error) {
      console.error(`Error getting email details for ${messageId}:`, error.message);
      return null;
    }
  }

  // Download attachment
  async downloadAttachment(messageId, attachmentId, filename, uploadFolder) {
    try {
      const attachment = await this.gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: attachmentId
      });

      const data = Buffer.from(attachment.data.data, 'base64');
      
      // Ensure upload folder exists
      await fs.ensureDir(uploadFolder);

      const filePath = path.join(uploadFolder, filename);
      await fs.writeFile(filePath, data);

      console.log(`Downloaded attachment: ${filename}`);
      return filePath;
    } catch (error) {
      console.error(`Error downloading attachment ${filename}:`, error.message);
      throw error;
    }
  }

  // Mark email as read
  async markAsRead(messageId) {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['UNREAD']
        }
      });
      console.log(`Marked email ${messageId} as read`);
    } catch (error) {
      console.error(`Error marking email as read:`, error.message);
    }
  }

  // Process all unread emails with Excel attachments
  async processUnreadEmails(uploadFolder) {
    try {
      const emails = await this.fetchEmailsWithExcelAttachments();
      const downloadedFiles = [];

      for (const email of emails) {
        console.log(`Processing email: ${email.subject}`);

        for (const attachment of email.attachments) {
          try {
            const filePath = await this.downloadAttachment(
              email.id,
              attachment.attachmentId,
              attachment.filename,
              uploadFolder
            );

            downloadedFiles.push({
              filePath,
              filename: attachment.filename,
              emailId: email.id,
              subject: email.subject,
              from: email.from,
              date: email.date
            });
          } catch (error) {
            console.error(`Failed to download ${attachment.filename}:`, error.message);
          }
        }

        // Mark email as read after processing
        await this.markAsRead(email.id);
      }

      return downloadedFiles;
    } catch (error) {
      console.error('Error processing unread emails:', error.message);
      throw error;
    }
  }
}

module.exports = new GmailService();
