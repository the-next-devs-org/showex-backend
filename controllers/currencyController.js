import axios from "axios";
import { apiConfig } from "../config/api.js";
import { translateText } from "../utils/translateHelper.js"; 






const getCurrencyPairNews = async (req, res) => {
  try {
    const currencypair = req.query.currencypair || "EUR-USD";
    const items = req.query.items || 3;
    const page = req.query.page || 1;
    const lang = req.query.lang || "en"; 

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
    const currencypairInclude =
      req.query.currencypairInclude || "EUR-USD,GBP-USD";
    const items = req.query.items || 50;
    const page = req.query.page || 1;
    const lang = req.query.lang || "en"; // 🔹 language param

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

    res.json({
      success: true,
      message: "Currency pair (include) news fetched successfully",
      data: {
        ...response.data,
        data: translatedData, // replace with translated results
      },
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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/stat?section=${section}&date=${date}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

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

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/stat?section=${section}&date=${date}&page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);

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

const getCategory = async (req, res) => {
  try {
    const section = req.query.section || "general";
    const items = req.query.items || 10;
    const page = req.query.page || 1;
    const lang = req.query.lang || "en"; // default Russian

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;

    const url = `${FOREX_API_BASE_URL}/category?section=${section}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);
    let data = response.data;

    // normalize array (handle API structure)
    if (data && data.data && Array.isArray(data.data)) {
      data = data.data;
    } else if (Array.isArray(data)) {
      data = data;
    } else {
      data = [];
    }

    // translate only if language not English
    if (lang !== "en" && Array.isArray(data)) {
      const translatedData = await Promise.all(
        data.map(async (item) => {
          const title = item.title || "";
          const description = item.description || "";
          const text = item.text || "";

          // parallel translate 3 fields
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

    res.json({
      success: true,
      message: `Category (${section}) news fetched successfully`,
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
};
