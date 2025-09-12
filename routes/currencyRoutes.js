const express = require("express");
const router = express.Router();

const { 
   getCurrencyPairNews,
   getCurrencyPairNewsMultiple , 
   getCurrencyPairNewsInclude,
   getCurrencyPairNewsOnly, 
    getGeneralForexNews,
    getTickersDB  
} = require("../controllers/currencyController");

router.get("/currencyPairNews", getCurrencyPairNews);

router.get("/currencyPairNewsMultiple", getCurrencyPairNewsMultiple);

router.get("/currencyPairNewsInclude", getCurrencyPairNewsInclude); 
router.get("/currencyPairNewsOnly", getCurrencyPairNewsOnly);
router.get("/generalForexNews", getGeneralForexNews);
router.get("/tickersDB", getTickersDB); 

module.exports = router;
