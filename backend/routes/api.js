const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadFolder = process.env.UPLOAD_FOLDER || './uploads';
    await fs.ensureDir(uploadFolder);
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.xlsx' || ext === '.xls') {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:proposalNumber', customerController.getCustomerByProposalNo);
router.post('/upload', upload.single('file'), customerController.uploadExcel);
router.get('/dashboard/stats', customerController.getDashboardStats);
router.get('/export', customerController.exportCustomers);
router.get('/sync/history', customerController.getSyncHistory);

module.exports = router;
