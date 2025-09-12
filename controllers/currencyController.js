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

// Multiple pairs include
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

// Specific pair only
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

module.exports = { 
  getCurrencyPairNews,
  getCurrencyPairNewsMultiple,
  getCurrencyPairNewsInclude,
  getCurrencyPairNewsOnly,
  getGeneralForexNews,
  getTickersDB
};
