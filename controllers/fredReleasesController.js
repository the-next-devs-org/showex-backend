const axios = require('axios');

const baseURL = process.env.FRED_BASE_URL;
const apiKey = process.env.FRED_API_KEY;

const getAllReleases = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/releases?api_key=${apiKey}&file_type=json`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getReleaseDates = async (req, res) => {
  try {
    const { release_id } = req.query;

    if (!release_id) {
      return res.status(400).json({ error: "release_id query parameter is required" });
    }

    const response = await axios.get(
      `${baseURL}/release/dates?api_key=${apiKey}&file_type=json&release_id=${release_id}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSeries = async (req, res) => {
  try {
    const { release_id } = req.query;

    if (!release_id) {
      return res.status(400).json({ error: "release_id query parameter is required" });
    }

    const response = await axios.get(
      `${baseURL}/release/series?api_key=${apiKey}&file_type=json&release_id=${release_id}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSources = async (req, res) => {
  try {
    const { release_id } = req.query;
    if (!release_id) {
      return res.status(400).json({ error: "release_id query parameter is required" });
    }

    const response = await axios.get(
      `${baseURL}/release/sources?api_key=${apiKey}&file_type=json&release_id=${release_id}`
    );

    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return res.status(400).json({
        error: "No source data available for this release_id",
        details: error.response.data.notes || null
      });
    }
    res.status(500).json({ error: error.message });
  }
};


const getTags = async (req, res) => {
  try {
    const { release_id } = req.query;
    if (!release_id) {
      return res.status(400).json({ error: "release_id query parameter is required" });
    }

    const response = await axios.get(
      `${baseURL}/release/tags?api_key=${apiKey}&file_type=json&release_id=${release_id}`
    );

    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return res.status(400).json({
        error: "No tags available for this release_id",
        details: error.response.data.notes || null
      });
    }
    res.status(500).json({ error: error.message });
  }
};


const getRelatedTags = async (req, res) => {
  try {
    const { release_id, tag_names } = req.query;

    if (!release_id || !tag_names) {
      return res.status(400).json({ error: "release_id and tag_names query parameters are required" });
    }

    const response = await axios.get(
      `${baseURL}/release/related_tags?api_key=${apiKey}&file_type=json&release_id=${release_id}&tag_names=${encodeURIComponent(tag_names)}`
    );

    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return res.status(400).json({
        error: "No related tags found for this release_id and tag_names",
        details: error.response.data.notes || null
      });
    }

    res.status(500).json({ error: error.message });
  }
};

const getTables = async (req, res) => {
  try {
    const { release_id } = req.query;

    if (!release_id) {
      return res.status(400).json({ error: "release_id query parameter is required" });
    }

    const response = await axios.get(
      `${baseURL}/release/tables?api_key=${apiKey}&file_type=json&release_id=${release_id}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReleases,
  getReleaseDates,
  getSeries,
  getSources,
  getTags,
  getRelatedTags,
  getTables
};
