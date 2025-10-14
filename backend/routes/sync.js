const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// Routes
router.post('/refresh', syncController.triggerSync);
router.get('/test-connection', syncController.testConnection);

module.exports = router;
