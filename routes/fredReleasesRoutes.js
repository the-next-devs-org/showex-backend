const express = require('express');
const router = express.Router();

const {
  getAllReleases,
  getReleaseDates,
  getSeries,
  getSources,
  getTags,
  getRelatedTags,
  getTables,
} = require('../controllers/fredReleasesController');

router.get('/fred/releases', getAllReleases);
router.get('/fred/release/dates', getReleaseDates);
router.get('/fred/release/series', getSeries);
router.get('/fred/release/sources', getSources);
router.get('/fred/release/tags', getTags);
router.get('/fred/release/related_tags', getRelatedTags);
router.get('/fred/release/tables', getTables);

module.exports = router;
