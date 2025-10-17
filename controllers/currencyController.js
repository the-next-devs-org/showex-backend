import axios from "axios";
import { apiConfig } from "../config/api.js"; 

const getCurrencyPairNews = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD";
    const items = req.query.items || 3;
    const page = req.query.page || 1;

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}?currencypair=${currencypair}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}?currencypair=${currencypair}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}?currencypair-include=${currencypairInclude}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}?currencypair-only=${currencypairOnly}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/category?section=general&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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
    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/account/tickersdbv2?token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/category?section=allcurrencypairs&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/top-mention?date=${date}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/stat?currencypair=${currencypair}&date=${date}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/stat?section=${section}&date=${date}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/stat?section=${section}&date=${date}&page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

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

const getAllEvents = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const cache = req.query.cache || true;

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/events?page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

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
    const eventid = req.params.eventid;  
    const page = req.query.page || 1;
    const cache = req.query.cache || true;

    if (!eventid) {
      return res.status(400).json({
        success: false,
        error: "eventid is required",
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/events?eventid=${eventid}&page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/trending-headlines?page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/sundown-digest?page=${page}&token=${FOREX_API_token_BASE_URL}`;

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

export {
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
  getSundownDigest,
};
