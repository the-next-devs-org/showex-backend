const axios = require("axios");

const getCurrencyPairNews = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD";
    const items = req.query.items || 3;
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1?currencypair=${currencypair}&items=${items}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Currency pair news fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching currency pair news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getCurrencyPairNewsMultiple = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD,GBP-USD";
    const items = req.query.items || 50;
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1?currencypair=${currencypair}&items=${items}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Currency pair news (multiple) fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching multiple currency pair news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getCurrencyPairNewsInclude = async (req, res) => {
  try {
    const currencypairInclude = req.query.currencypairInclude || "EUR-USD,GBP-USD";
    const items = req.query.items || 50;
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1?currencypair-include=${currencypairInclude}&items=${items}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Currency pair (include) news fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching currency pair (include) news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const getCurrencyPairNewsOnly = async (req, res) => {
  try {
    const currencypairOnly = req.query.currencypairOnly || "EUR-USD";
    const items = req.query.items || 50;
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1?currencypair-only=${currencypairOnly}&items=${items}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Currency pair (only) news fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching currency pair (only) news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getGeneralForexNews = async (req, res) => {
  try {
    const items = req.query.items || 50;
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1/category?section=general&items=${items}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "General Forex news fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching general forex news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const getTickersDB = async (req, res) => {
  try {
    const url = `https://forexnewsapi.com/api/v1/account/tickersdbv2?token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Tickers DB fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching Tickers DB:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllCurrencyPairsNews = async (req, res) => {
  try {
    const items = req.query.items || 50;
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1/category?section=allcurrencypairs&items=${items}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "All Currency Pairs news fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching All Currency Pairs news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const getTopMentionedCurrencyPairs = async (req, res) => {
  try {
    const date = req.query.date || "last7days";   
    const cache = req.query.cache || true;        

    const url = `https://forexnewsapi.com/api/v1/top-mention?date=${date}&cache=${cache}&2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Top Mentioned Currency Pairs fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching Top Mentioned Currency Pairs:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getSentimentAnalysis = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD"; 
    const date = req.query.date || "last30days";              
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1/stat?currencypair=${currencypair}&date=${date}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Sentiment Analysis fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching Sentiment Analysis:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllCurrencyPairsSentiment = async (req, res) => {
  try {
    const section = "allcurrencypairs";             
    const date = req.query.date || "last30days";    
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1/stat?section=${section}&date=${date}&page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "All Currency Pairs Sentiment Analysis fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching All Currency Pairs Sentiment Analysis:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getGeneralSentiment = async (req, res) => {
  try {
    const section = "general";                     
    const date = req.query.date || "last30days";   
    const page = req.query.page || 1;
    const cache = req.query.cache || true;         

    const url = `https://forexnewsapi.com/api/v1/stat?section=${section}&date=${date}&page=${page}&cache=${cache}&2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "General Forex News Sentiment Analysis fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching General Forex Sentiment Analysis:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 1. Get All Events
const getAllEvents = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const cache = req.query.cache || true;

    const url = `https://forexnewsapi.com/api/v1/events?page=${page}&cache=${cache}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Events fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const eventid = req.query.eventid;  
    const page = req.query.page || 1;
    const cache = req.query.cache || true;

    if (!eventid) {
      return res.status(400).json({
        success: false,
        error: "eventid is required",
      });
    }

    const url = `https://forexnewsapi.com/api/v1/events?eventid=${eventid}&page=${page}&cache=${cache}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: `Event data for ID ${eventid} fetched successfully`,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching event by ID:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getTrendingHeadlines = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1/trending-headlines?page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Trending headlines fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching trending headlines:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getSundownDigest = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const url = `https://forexnewsapi.com/api/v1/sundown-digest?page=${page}&token=2fy7verxsu14efrjwk4gvrthvaunxddcel5dghen`;

    const response = await axios.get(url);

    res.json({
      success: true,
      message: "Sundown Digest fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching Sundown Digest:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


module.exports = { 
  getCurrencyPairNews,
  getCurrencyPairNewsMultiple,
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
};
