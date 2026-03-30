const express = require('express');
const { renderTrackingPage } = require('../controllers/linkController');

const router = express.Router();

router.get('/l/:token', renderTrackingPage);

module.exports = router;
