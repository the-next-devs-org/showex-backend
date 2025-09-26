const express = require("express");
const router = express.Router();
const { fetchCategory , fetchAllCategories} = require("../controllers/fredCategoriesController");
//const {fetchAllCategories} = require ("../controllers/fredController")

router.get("/fred/category", fetchCategory);
router.get("/fred/allCategory" , fetchAllCategories)

module.exports = router;
