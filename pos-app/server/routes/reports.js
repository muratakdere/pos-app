const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.post('/close-day', reportsController.closeDay);

module.exports = router;
