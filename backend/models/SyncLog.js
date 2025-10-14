const mongoose = require('mongoose');

const syncLogSchema = new mongoose.Schema({
  syncTime: {
    type: Date,
    default: Date.now
  },
  emailsProcessed: {
    type: Number,
    default: 0
  },
  recordsCreated: {
    type: Number,
    default: 0
  },
  recordsUpdated: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'partial'],
    default: 'success'
  },
  errors: {
    type: Array,
    default: []
  },
  filesProcessed: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SyncLog', syncLogSchema);
