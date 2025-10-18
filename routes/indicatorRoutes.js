const express = require('express');
const router = express.Router();
const { listIndicators, history } = require('../controllers/indicatorsController');

router.get('/', listIndicators);

router.get('/history/:seriesId', history);

module.exports = router;
