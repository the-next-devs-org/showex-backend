const axios = require('axios');

const BASE_URL = process.env.FRED_BASE_URL;
const API_KEY = process.env.FRED_API_KEY; 

const getAllSources = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/sources`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
      },
    });
    res.json(response.data);
  } catch (error) {
    if (error.response) return res.status(error.response.status).json(error.response.data);
    res.status(500).json({ error: error.message });
  }
};

const getSource = async (req, res) => {
  try {
    const { source_id } = req.query;
    if (!source_id) {
      return res.status(400).json({ error: 'source_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/source`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        source_id
      },
    });
    res.json(response.data);
  } catch (error) {
    if (error.response) return res.status(error.response.status).json(error.response.data);
    res.status(500).json({ error: error.message });
  }
};

const getSourceReleases = async (req, res) => {
  try {
    const { source_id } = req.query;
    if (!source_id) {
      return res.status(400).json({ error: 'source_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/source/releases`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        source_id,
      },
    });
    res.json(response.data);
  } catch (error) {
    if (error.response) return res.status(error.response.status).json(error.response.data);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSources,
  getSource,
  getSourceReleases
};
