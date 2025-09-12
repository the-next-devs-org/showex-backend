const express = require("express");
const router = express.Router();

const { 
   getCurrencyPairNews,
   getCurrencyPairNewsMultiple , 
   getCurrencyPairNewsInclude,
   getCurrencyPairNewsOnly, 
    getGeneralForexNews,
    getTickersDB,
    getAllCurrencyPairsNews,
    getTopMentionedCurrencyPairs,
    getSentimentAnalysis,
    getAllCurrencyPairsSentiment,
    getGeneralSentiment,
    getAllEvents,
    getEventById,
    getTrendingHeadlines,
    getSundownDigest
    
} = require("../controllers/currencyController");

router.get("/currencyPairNews", getCurrencyPairNews);
router.get("/currencyPairNewsMultiple", getCurrencyPairNewsMultiple);
router.get("/currencyPairNewsInclude", getCurrencyPairNewsInclude); 
router.get("/rencyPairNcurewsOnly", getCurrencyPairNewsOnly);
router.get("/generalForexNews", getGeneralForexNews);
router.get("/tickersDB", getTickersDB);
router.get("/allCurrencyPairsNews", getAllCurrencyPairsNews);
router.get("/topMentionedCurrencyPairs", getTopMentionedCurrencyPairs);
router.get("/sentimentAnalysis", getSentimentAnalysis);
router.get("/allCurrencyPairsSentiment", getAllCurrencyPairsSentiment);
router.get("/generalSentiment", getGeneralSentiment);
router.get("/allEvents", getAllEvents);
router.get("/eventById/:id", getEventById);
router.get("/trendingHeadlines", getTrendingHeadlines);
router.get("/sundownDigest", getSundownDigest);


module.exports = router;
