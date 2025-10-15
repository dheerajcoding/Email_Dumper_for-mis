const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  updatedAt: {
    type: Date,
    default: Date.now
  },
  changes: {
    type: Object,
    required: true
  }
});

const customerSchema = new mongoose.Schema({
  // Primary Key (NO LONGER UNIQUE - allows duplicates to track versions)
  proposalNumber: {
    type: String,
    required: true,
    index: true
  },
  
  // Duplicate Tracking
  updateCount: {
    type: Number,
    default: 1
  },
  isDuplicate: {
    type: Boolean,
    default: false
  },
  importedAt: {
    type: Date,
    default: Date.now
  },
  
  // Proposer Information
  proposerCode: String,
  proposerName: String,
  
  // Business Details
  businessType: String,
  sourceCode: String,
  createdDate: String,
  
  // Inwarding Information
  inwardingUserCode: String,
  proposalIntimationDate: String,
  intimationAgeing: String,
  intimationSubAgeing: String,
  
  // Policy Information
  policyIssueDate: String,
  policyStatus: String,
  subStatus: String,
  discrepancyRemark: String,
  latestSubStatusDate: String,
  subStatusAgeing: String,
  subStatusSubAgeing: String,
  
  // Location & Channel
  branchCode: String,
  intermediaryCode: String,
  channel: String,
  
  // Flags & Features
  goGreen: String,
  combiFlag: String,
  applicableSumInsured: String,
  
  // Product Details
  productName: String,
  receiptTag: String,
  
  // Followup & Team
  latestFollowupDate: String,
  latestTeamName: String,
  
  // Intermediary Details
  intermediaryName: String,
  intermediaryClassification: String,
  inwardingBranchName: String,
  
  // Employee & Cover
  employeeDiscount: String,
  coverType: String,
  lgCode: String,
  
  // Lead & Partner
  leadId: String,
  partnerSpCode: String,
  salesManagerCode: String,
  salesManagerName: String,
  
  // Policy Dates & Details
  policyExpiryDate: String,
  nationality: String,
  gstExemption: String,
  premiumMode: String,
  
  // Premium
  netPremium: String,
  grossPremium: String,
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Version History
  history: [historySchema]
}, {
  timestamps: true
});

// Indexes for faster searches
customerSchema.index({ proposalNumber: 1 });
customerSchema.index({ proposerName: 1 });
customerSchema.index({ policyStatus: 1 });
customerSchema.index({ intermediaryCode: 1 });
customerSchema.index({ branchCode: 1 });

// Use the 'mails' collection in the emaildumper database
module.exports = mongoose.model('Customer', customerSchema, 'mails');
