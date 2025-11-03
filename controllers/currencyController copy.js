import axios from "axios";
import { apiConfig } from "../config/api.js";
import { translateText } from "../utils/translateHelper.js";

import Register from "../Model/registerModel.js";
import Notification from "../Model/Notification.js";
import nodemailer from "nodemailer";
import { createClient } from "redis";

// Create Redis client instance
let redisClient;

const initRedis = async () => {
  redisClient = createClient({
    url: 'redis://127.0.0.1:6379',
    socket: {
      host: '127.0.0.1',
      port: 6379,
      connectTimeout: 5000,
      timeout: 5000,
      reconnectStrategy: (retries) => {
        if (retries > 3) return new Error('Redis connection failed');
        return Math.min(retries * 100, 1000);
      }
    }
  });

  // Handle Redis connection events
  redisClient.on('connect', () => console.log('Redis Client connecting...'));
  redisClient.on('ready', () => console.log('Redis Client connected successfully'));
  redisClient.on('error', (err) => console.log('Redis Client Error:', err));
  redisClient.on('end', () => console.log('Redis Client disconnected'));

  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis connection error:', err);
    // Fallback to in-memory cache if Redis fails
    const cache = new Map();
    redisClient = {
      get: async (key) => cache.get(key),
      setEx: async (key, ttl, value) => {
        cache.set(key, value);
        setTimeout(() => cache.delete(key), ttl * 1000);
      }
    };
  }
};

// Initialize Redis
initRedis();

const transporter = nodemailer.createTransport({
  host: 'smtp.mailersend.net',
  port: 587,
  secure: false,
  auth: {
    user: 'MS_RV276m@test-ywj2lpn1dwqg7oqz.mlsender.net',
    pass: 'mssp.i0pAJ9H.pq3enl69o68l2vwr.vYDLDnA'
  }
});


const getCurrencyPairNews = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD";
    const items = req.query.items || 3;
    const page = req.query.page || 1;
    const lang = req.query.lang || "en";

    // Create cache key
    const cacheKey = `currencyPairNews:${currencypair}:${items}:${page}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached currency pair news");
      return res.json({
        success: true,
        message: "Currency pair news fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}?currencypair=${currencypair}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    let data = response.data;

    // normalize array
    if (data && data.data && Array.isArray(data.data)) {
      data = data.data;
    } else if (Array.isArray(data)) {
      data = data;
    } else {
      data = [];
    }

    // translate everything except English
    if (lang !== "en" && Array.isArray(data)) {
      const translatedData = await Promise.all(
        data.map(async (item) => {
          const title = item.title || "";
          const description = item.description || "";
          const text = item.text || "";

          const [tTitle, tDescription, tText] = await Promise.all([
            title ? translateText(title, lang) : title,
            description ? translateText(description, lang) : description,
            text ? translateText(text, lang) : text,
          ]);

          return {
            ...item,
            title: tTitle,
            description: tDescription,
            text: tText,
          };
        })
      );

      data = translatedData;
    }

    // Save to Redis with 150 sec expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(data));

    res.json({
      success: true,
      message: "Currency pair news fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching currency pair news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


























// const getCurrencyPairNews = async (req, res) => {
//   try {
//     const currencypair = req.query.currencypair || "EUR-USD";
//     const items = req.query.items || 3;
//     const page = req.query.page || 1;

//     const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

//     const url = `${FOREX_API_BASE_URL}?currencypair=${currencypair}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

//     const response = await axios.get(url);

//     res.json({
//       success: true,
//       message: "Currency pair news fetched successfully",
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("Error fetching currency pair news:", error.message);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// const getCurrencyPairNews = async (req, res) => {
//   console.log("getCurrencyPairNews called with query:");
//   try {
//     const currencypair = req.query.currencypair || "EUR-USD";
//     const items = req.query.items || 3;
//     const page = req.query.page || 1;
//     const lang = "ru"; // 👈 get language from frontend

//     const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
//     const url = `${FOREX_API_BASE_URL}?currencypair=${currencypair}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

//     const response = await axios.get(url);
//     const newsData = response.data?.data || [];

//     // 👇 Translate news titles & descriptions
//     const translatedNews = await Promise.all(
//       newsData.map(async (item) => ({
//         ...item,
//         title: await translateText(item.title, lang),
//         description: await translateText(item.description, lang),
//       }))
//     );

//     res.json({
//       success: true,
//       message: "Currency pair news fetched successfully",
//       data: translatedNews,
//     });
//   } catch (error) {
//     console.error("Error fetching currency pair news:", error.message);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

const getCurrencyPairNewsMultiple = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD,GBP-USD";
    const items = req.query.items || 50;
    const page = req.query.page || 1;

    // Create cache key
    const cacheKey = `currencyPairNewsMultiple:${currencypair}:${items}:${page}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "Currency pair news (multiple) fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}?currencypair=${currencypair}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 sec expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

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
    const currencypairInclude =
      req.query.currencypairInclude || "EUR-USD,GBP-USD";
    const items = req.query.items || 50;
    const page = req.query.page || 1;
    const lang = req.query.lang || "en"; // 🔹 language param

    // Create cache key
    const cacheKey = `currencyPairNewsInclude:${currencypairInclude}:${items}:${page}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "Currency pair (include) news fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}?currencypair-include=${currencypairInclude}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);
    const newsData = response?.data?.data || [];

    let translatedData = newsData;

    // 🔹 Only translate if lang ≠ "en"
    if (lang !== "en" && newsData.length > 0) {
      translatedData = await Promise.all(
        newsData.map(async (item) => {
          const title = item.title || "";
          const text = item.text || "";

          const [tTitle, tText] = await Promise.all([
            title ? translateText(title, lang) : title,
            text ? translateText(text, lang) : text,
          ]);

          return {
            ...item,
            title: tTitle,
            text: tText,
          };
        })
      );
    }

    const responseData = {
      ...response.data,
      data: translatedData
    };

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(responseData));

    res.json({
      success: true,
      message: "Currency pair (include) news fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching currency pair (include) news:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch currency pair (include) news",
      error: error.message,
    });
  }
};


const getCurrencyPairNewsOnly = async (req, res) => {
  try {
    const currencypairOnly = req.query.currencypairOnly || "EUR-USD";
    const items = req.query.items || 50;
    const page = req.query.page || 1;

    // Create cache key
    const cacheKey = `currencyPairNewsOnly:${currencypairOnly}:${items}:${page}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "Currency pair (only) news fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}?currencypair-only=${currencypairOnly}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

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

    // Create cache key
    const cacheKey = `generalForexNews:${items}:${page}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "General Forex news fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/category?section=general&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

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
    // Create cache key
    const cacheKey = 'tickersDB';
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "Tickers DB fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/account/tickersdbv2?token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

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

    // Create cache key
    const cacheKey = `allCurrencyPairsNews:${items}:${page}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "All Currency Pairs news fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/category?section=allcurrencypairs&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

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

    // Create cache key
    const cacheKey = `topMentionedCurrencyPairs:${date}:${cache}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "Top Mentioned Currency Pairs fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/top-mention?date=${date}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

    res.json({
      success: true,
      message: "Top Mentioned Currency Pairs fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error fetching Top Mentioned Currency Pairs:",
      error.message
    );
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// const getSentimentAnalysis = async (req, res) => {
//   try {
//     const currencypair = req.query.currencypair || "EUR-USD";
//     const date = req.query.date || "last30days";
//     const page = req.query.page || 1;

//     const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

//     const url = `${FOREX_API_BASE_URL}/stat?currencypair=${currencypair}&date=${date}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

//     const response = await axios.get(url);

//     console.log("Sentiment Analysis response data:", response.data);

//     res.json({
//       success: true,
//       message: "Sentiment Analysis fetched successfully",
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("Error fetching Sentiment Analysis:", error.message);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

const getSentimentAnalysis = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD";
    const date = req.query.date || "last30days";
    const page = Number(req.query.page) || 1;
    const lang = req.query.lang || "en"; // 👈 added language param

    // Create cache key
    const cacheKey = `sentimentAnalysis:${currencypair}:${date}:${page}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.json({
        success: true,
        message: `Sentiment Analysis fetched from cache (${lang})`,
        total_pages: parsedData.total_pages,
        totals: parsedData.totals,
        data: parsedData.data
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url =
      `${FOREX_API_BASE_URL}/stat` +
      `?currencypair=${encodeURIComponent(currencypair)}` +
      `&date=${encodeURIComponent(date)}` +
      `&page=${page}` +
      `&token=${encodeURIComponent(FOREX_API_token_BASE_URL)}`;

    const response = await axios.get(url);
    const payload = response.data || {};

    const totals = Object.entries(payload.total || {}).map(
      ([pair, totalsObj]) => ({
        pair,
        ...(totalsObj || {}),
      })
    );

    const rows = Object.entries(payload.data || {}).flatMap(
      ([dateKey, pairObj]) =>
        Object.entries(pairObj || {}).map(([pair, metrics]) => ({
          date: dateKey,
          pair,
          ...(metrics || {}),
        }))
    );

    return res.json({
      success: true,
      message: `Sentiment Analysis fetched successfully (${lang})`, // 👈 optional trace
      total_pages: payload.total_pages ?? null,
      totals,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching Sentiment Analysis:", error?.message);
    const status = error?.response?.status || 500;
    return res.status(status).json({
      success: false,
      error: error?.message || "Unknown error",
      details: error?.response?.data ?? null,
    });
  }
};


const getAllCurrencyPairsSentiment = async (req, res) => {
  try {
    const section = "allcurrencypairs";
    const date = req.query.date || "last30days";
    const page = req.query.page || 1;

    // Create cache key
    const cacheKey = `allCurrencyPairsSentiment:${date}:${page}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "All Currency Pairs Sentiment Analysis fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/stat?section=${section}&date=${date}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

    res.json({
      success: true,
      message: "All Currency Pairs Sentiment Analysis fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error fetching All Currency Pairs Sentiment Analysis:",
      error.message
    );
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

    // Create cache key
    const cacheKey = `generalSentiment:${date}:${page}:${cache}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "General Forex News Sentiment Analysis fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/stat?section=${section}&date=${date}&page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(response.data));

    res.json({
      success: true,
      message: "General Forex News Sentiment Analysis fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error fetching General Forex Sentiment Analysis:",
      error.message
    );
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
    const lang = req.query.lang || "en"; // language param

    // Create cache key
    const cacheKey = `allEvents:${page}:${cache}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: `Events fetched from cache (${lang})`,
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/events?page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    let apiData = response.data;

    // ✅ agar andar array hai to usko nikal ke translate karenge
    if (apiData && apiData.data && Array.isArray(apiData.data)) {
      if (lang !== "en") {
        const translatedEvents = await Promise.all(
          apiData.data.map(async (item) => {
            const name = item.event_name || "";
            const text = item.event_text || "";

            const [tName, tText] = await Promise.all([
              name ? translateText(name, lang) : name,
              text ? translateText(text, lang) : text,
            ]);

            return {
              ...item,
              event_name: tName,
              event_text: tText,
            };
          })
        );

        apiData.data = translatedEvents; // 👈 translation replace kar do
      }
    }

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(apiData));

    // ✅ return structure same rahe
    res.json({
      success: true,
      message: `Events fetched successfully (${lang})`,
      data: apiData,
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
    const lang = req.query.lang || "en"; // 👈 language param

    if (!eventid) {
      return res.status(400).json({
        success: false,
        error: "eventid is required",
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/events?eventid=${eventid}&page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);
    let apiData = response.data;

    // ✅ agar language English nahi hai to translation karni hai
    if (lang !== "en" && apiData) {
      // 1️⃣ event name aur text translate karo
      if (apiData.event_name || apiData.event_text) {
        const [tEventName, tEventText] = await Promise.all([
          apiData.event_name ? translateText(apiData.event_name, lang) : apiData.event_name,
          apiData.event_text ? translateText(apiData.event_text, lang) : apiData.event_text,
        ]);

        apiData.event_name = tEventName;
        apiData.event_text = tEventText;
      }

      // 2️⃣ agar andar articles (data array) hain to unko bhi translate karo
      if (apiData.data && Array.isArray(apiData.data)) {
        const translatedArticles = await Promise.all(
          apiData.data.map(async (article) => {
            const title = article.title || "";
            const text = article.text || "";

            const [tTitle, tText] = await Promise.all([
              title ? translateText(title, lang) : title,
              text ? translateText(text, lang) : text,
            ]);

            return {
              ...article,
              title: tTitle,
              text: tText,
            };
          })
        );
        apiData.data = translatedArticles;
      }
    }

    // ✅ response same format me bhejna
    res.json({
      success: true,
      message: `Event data for ID ${eventid} fetched successfully (${lang})`,
      data: apiData,
    });
  } catch (error) {
    console.error("Error fetching event by ID:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};





// const getTrendingHeadlines = async (req, res) => {
//   try {
//     const page = req.query.page || 1;

//     const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

//     const url = `${FOREX_API_BASE_URL}/trending-headlines?page=${page}&token=${FOREX_API_token_BASE_URL}`;

//     const response = await axios.get(url);

//     res.json({
//       success: true,
//       message: "Trending headlines fetched successfully",
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("Error fetching trending headlines:", error.message);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };





const getTrendingHeadlines = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const lang = req.query.lang || "en";

    // Create cache key
    const cacheKey = `trendingHeadlines:${page}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "Trending headlines fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/trending-headlines?page=${page}&token=${FOREX_API_token_BASE_URL}`;
    const response = await axios.get(url);

    let data = response.data;

    // normalize structure (agar data array me ho)
    if (data && data.data && Array.isArray(data.data)) {
      data = data.data;
    } else if (Array.isArray(data)) {
      data = data;
    } else {
      data = [];
    }

    // 🔹 agar language English nahi hai to translate karo
    if (lang !== "en" && Array.isArray(data)) {
      const translatedData = await Promise.all(
        data.map(async (item) => {
          const title = item.headline || "";
          const description = item.description || "";
          const text = item.text || "";

          const [tTitle, tDescription, tText] = await Promise.all([
            title ? translateText(title, lang) : title,
            description ? translateText(description, lang) : description,
            text ? translateText(text, lang) : text,
          ]);

          return {
            ...item,
            headline: tTitle,
            description: tDescription,
            text: tText,
          };
        })
      );

      data = translatedData;
    }

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(data));

    res.json({
      success: true,
      message: "Trending headlines fetched successfully",
      data,
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
    const lang = req.query.lang || "en"; // translation ke liye add kiya

    // Create cache key
    const cacheKey = `sundownDigest:${page}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "Sundown Digest fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/sundown-digest?page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

    let data = response.data;

    // normalize array
    if (data && data.data && Array.isArray(data.data)) {
      data = data.data;
    } else if (Array.isArray(data)) {
      data = data;
    } else {
      data = [];
    }

    // translate if language is not English
    if (lang !== "en" && Array.isArray(data)) {
      const translatedData = await Promise.all(
        data.map(async (item) => {
          const title = item.title || "";
          const description = item.description || "";
          const text = item.text || "";
          const headline = item.headline || "";

          const [tHeadline, tTitle, tDescription, tText] = await Promise.all([
            headline ? translateText(headline, lang) : headline,
            title ? translateText(title, lang) : title,
            description ? translateText(description, lang) : description,
            text ? translateText(text, lang) : text,
          ]);

          return {
            ...item,
            headline: tHeadline,
            title: tTitle,
            description: tDescription,
            text: tText,
          };
        })
      );


      data = translatedData;
    }

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(data));

    res.json({
      success: true,
      message: "Sundown Digest fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching Sundown Digest:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const getCategory = async (req, res) => {
  try {
    const section = req.query.section || "general";
    const items = req.query.items || 10;
    const page = req.query.page || 1;
    const lang = req.query.lang || "en";

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    // ✅ cache key unique for section+page+lang
    const cacheKey = `category:${section}:page${page}:items${items}:lang${lang}`;

    // 1️⃣ Redis check
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached category data");
      return res.json({
        success: true,
        message: `Category (${section}) news fetched successfully (from cache)`,
        data: JSON.parse(cachedData),
      });
    }

    // 2️⃣ Fetch new data from API
    const url = `${FOREX_API_BASE_URL}/category?section=${section}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;
    const response = await axios.get(url);

    let data = response.data;

    // normalize array
    if (data && data.data && Array.isArray(data.data)) {
      data = data.data;
    } else if (Array.isArray(data)) {
      data = data;
    } else {
      data = [];
    }

    // translate if lang !== "en"
    if (lang !== "en" && Array.isArray(data)) {
      const translatedData = await Promise.all(
        data.map(async (item) => {
          const title = item.title || "";
          const description = item.description || "";
          const text = item.text || "";

          const [tTitle, tDescription, tText] = await Promise.all([
            title ? translateText(title, lang) : title,
            description ? translateText(description, lang) : description,
            text ? translateText(text, lang) : text,
          ]);

          return {
            ...item,
            title: tTitle,
            description: tDescription,
            text: tText,
          };
        })
      );

      data = translatedData;
    }

    // 3️⃣ Save to Redis with 150 sec expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(data));

    res.json({
      success: true,
      message: `Category (${section}) news fetched successfully (from API)`,
      data,
    });

  } catch (error) {
    console.error("Error fetching category news:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = req.query.page || 1;
    const lang = req.query.lang || "en";

    // Create cache key
    const cacheKey = `newsById:${id}:${page}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "News fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/trending-headlines?page=${page}&token=${FOREX_API_token_BASE_URL}`;
    const response = await axios.get(url);
    const data = response?.data?.data;

    const newsItem = data?.find((item) => item.id === Number(id));
    if (!newsItem) {
      return res.status(404).json({ success: false, message: "News not found for given ID" });
    }

    let translatedItem = newsItem;

    if (lang !== "en") {
      const title = newsItem.title || "";
      const description = newsItem.description || "";
      const text = newsItem.text || "";
      const headline = newsItem.headline || "";

      const [tTitle, tDescription, tText, tHeadline] = await Promise.all([
        title ? translateText(title, lang) : title,
        description ? translateText(description, lang) : description,
        text ? translateText(text, lang) : text,
        headline ? translateText(headline, lang) : headline,
      ]);

      translatedItem = {
        ...newsItem,
        title: tTitle,
        description: tDescription,
        text: tText,
        headline: tHeadline,
      };
    }

    // Save to Redis with 150 seconds expiry
    await redisClient.setEx(cacheKey, 150, JSON.stringify(translatedItem));

    res.status(200).json({
      success: true,
      message: `News with ID ${id} fetched successfully`,
      data: translatedItem,
    });
  } catch (error) {
    console.error("Error fetching news by ID:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};



const getAllTrendingHeadlines = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const lang = req.query.lang || "en"; // 🔹 language param

    // Create cache key
    const cacheKey = `allTrendingHeadlines:${page}:${lang}`;
    
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: "All trending headlines fetched from cache",
        data: JSON.parse(cachedData)
      });
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/trending-headlines?page=${page}&token=${FOREX_API_token_BASE_URL}`;
    const response = await axios.get(url);

    const newsData = response?.data?.data || [];

    let translatedData = newsData;

    // 🔹 Only translate if lang ≠ "en"
    if (lang !== "en" && newsData.length > 0) {
      translatedData = await Promise.all(
        newsData.map(async (item) => {
          const headline = item.headline || "";
          const text = item.text || "";

          const [tHeadline, tText] = await Promise.all([
            headline ? translateText(headline, lang) : headline,
            text ? translateText(text, lang) : text,
          ]);

          return {
            ...item,
            headline: tHeadline,
            text: tText,
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      message: "All trending headlines fetched successfully",
      data: {
        ...response.data,
        data: translatedData, // replace original list with translated list
      },
    });
  } catch (error) {
    console.error("Error fetching all trending headlines:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending headlines",
      error: error.message,
    });
  }
};


const getNegativeSentimentAndNotify = async (req, res) => {
  try {
    // Default values for cron job or direct function call
    let section = "allcurrencypairs";
    let items = 50;
    let page = 1;

    // If called as an API endpoint, use query parameters
    if (req && req.query) {
      section = req.query.section || "allcurrencypairs";
      items = req.query.items || 50;
      page = req.query.page || 1;
    }

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    // 1. Get news from API
    const url = `${FOREX_API_BASE_URL}/category?section=${section}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;
    const response = await axios.get(url);

    // 2. Filter negative sentiment news
    const negativeNews = response.data.data.filter(item => item.sentiment === "Negative");

    if (negativeNews.length > 0) {
      // 3. Get all users from database
      const users = await Register.findAll({
        attributes: ['id', 'emailaddress', 'username', 'firstname', 'lastname']
      });

      // 4. Create notifications and send emails for each user
      for (const user of users) {
        // Create HTML content for email
        const emailContent = negativeNews.map(news => `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="color: #d32f2f;">Alert for ${news.currency.join(", ")}</h3>
            <p><strong>Title:</strong> ${news.title}</p>
            <p><strong>Details:</strong> ${news.text}</p>
            <p><strong>Sentiment:</strong> Negative</p>
            <p><strong>Source:</strong> ${news.source_name}</p>
            <p><strong>Date:</strong> ${news.date}</p>
            <a href="${news.news_url}" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read More</a>
          </div>
        `).join('');

        // Send email
        await transporter.sendMail({
          from: 'MS_RV276m@test-ywj2lpn1dwqg7oqz.mlsender.net',
          to: user.emailaddress,
          subject: "⚠️ Negative Currency Alert - ShowEx",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d32f2f;">Important Currency Alert</h2>
              <p>Dear ${user.firstname} ${user.lastname},</p>
              <p>We've detected negative sentiment for some currency pairs you might be interested in:</p>
              ${emailContent}
              <p style="margin-top: 20px;">Stay informed and trade wisely!</p>
              <p>Best regards,<br>ShowEx Team</p>
            </div>
          `
        });

        // Create more concise notification record
        const conciseNotification = {
          title: "Negative Currency Alerts",
          alerts: negativeNews.map(news => ({
            pair: news.currency[0],
            title: news.title.substring(0, 100) // Limit title length
          }))
        };

        // await Notification.create({
        //   user_id: user.id,
        //   notification: JSON.stringify(conciseNotification).substring(0, 900), // Ensure we stay under 1000 char limit
        //   currencies: JSON.stringify(negativeNews.slice(0, 5).flatMap(news => news.currency)) // Limit to first 5 currencies
        // });
      }
    }

    res.json({
      success: true,

      message: "Negative sentiment news processed and notifications sent",
      data: {
        negativeNews,
        notificationCount: negativeNews.length
      }
    });

  } catch (error) {
    console.error("Error in getNegativeSentimentAndNotify:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
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
  getCategory,
  getNewsById,
  getAllTrendingHeadlines,
  getNegativeSentimentAndNotify,
};
