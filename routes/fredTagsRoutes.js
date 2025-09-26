const express = require("express");
const router = express.Router();
const {
    getTags,
    getRelatedTags,
    getSeriesByTags,
} = require("../controllers/fredTagsController");

router.get("/tags", getTags);

router.get("/tags/related", getRelatedTags);

router.get("/tags/series", getSeriesByTags);

module.exports = router;
