// const express = require('express');
// const router = express.Router();
// const { listIndicators, history } = require('../controllers/indicatorsController');

// router.get('/', listIndicators);

// router.get('/history/:seriesId', history);

// module.exports = router;



// src/routes/indicatorRoutes.js
const express = require('express');
const router = express.Router();
const {
  listIndicators,
  history,
} = require('../controllers/indicatorsController');

// GET all main indicators (cached or fresh)
router.get('/', listIndicators);

// GET history for specific indicator
router.get('/history/:seriesId', history);

module.exports = router;
