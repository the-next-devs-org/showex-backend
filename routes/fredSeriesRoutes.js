const express = require('express');
const router = express.Router();
const {
  getSeries,
  getSeriesCategories,
  getSeriesObservations,
  getSeriesRelease,
  searchSeries,
  searchSeriesTags,
  searchSeriesRelatedTags,
  getSeriesTags,
  getSeriesUpdates,
  getSeriesVintageDates,
} = require('../controllers/fredSeriesController');

router.get('/fred/series', getSeries);
router.get('/fred/series/categories', getSeriesCategories);
router.get('/fred/series/observations', getSeriesObservations);
router.get('/fred/series/release', getSeriesRelease);
router.get('/fred/series/search', searchSeries);
router.get('/fred/series/search/tags', searchSeriesTags);
router.get('/fred/series/search/related_tags', searchSeriesRelatedTags);
router.get('/fred/series/tags', getSeriesTags);
router.get('/fred/series/updates', getSeriesUpdates);
router.get('/fred/series/vintagedates', getSeriesVintageDates);

module.exports = router;
