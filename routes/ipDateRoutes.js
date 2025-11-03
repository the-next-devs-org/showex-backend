const express = require('express');
const router = express.Router();
const { saveIpDate, getIpDates } = require('../controllers/ipDateController');

router.post('/save', saveIpDate);
router.get('/all', getIpDates);

module.exports = router;
