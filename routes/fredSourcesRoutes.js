const express = require('express');
const router = express.Router();
const {
  getAllSources,
  getSource,
  getSourceReleases,
} = require('../controllers/fredSourcesController');

router.get('/fred/sources', getAllSources);
router.get('/fred/source', getSource);
router.get('/fred/source/releases', getSourceReleases);

module.exports = router;
