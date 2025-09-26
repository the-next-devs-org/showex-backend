const axios = require("axios");
const { FRED_API_KEY, FRED_BASE_URL } = process.env;

const getTags = async (req, res) => {
  try {
    const { tag_names, limit, offset } = req.query;

    const response = await axios.get(`${FRED_BASE_URL}/tags`, {
      params: {
        api_key: FRED_API_KEY,
        file_type: "json",
        tag_names,
        limit,
        offset,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get related tags
const getRelatedTags = async (req, res) => {
  try {
    const { tag_names } = req.query;

    if (!tag_names) {
      return res.status(400).json({ error: "tag_names is required" });
    }

    const response = await axios.get(`${FRED_BASE_URL}/related_tags`, {
      params: {
        api_key: FRED_API_KEY,
        file_type: "json",
        tag_names,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get series matching tags
const getSeriesByTags = async (req, res) => {
  try {
    const { tag_names } = req.query;

    if (!tag_names) {
      return res.status(400).json({ error: "tag_names is required" });
    }

    const response = await axios.get(`${FRED_BASE_URL}/tags/series`, {
      params: {
        api_key: FRED_API_KEY,
        file_type: "json",
        tag_names,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTags,
  getRelatedTags,
  getSeriesByTags,
};
