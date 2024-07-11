
const express = require('express');
const router = express.Router();
const { subscribeEmail } = require('../controllers/subscriberController');

// POST request to subscribe an email
router.post('/subscribe', subscribeEmail);

module.exports = router;