const axios = require('axios');

const BASE_URL = process.env.FRED_BASE_URL
const API_KEY  = process.env.FRED_API_KEY

const getSeries = async (req, res) => {
  try {
    const { series_id } = req.query;

    if (!series_id) {
      return res.status(400).json({ error: 'series_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/series`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_id
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSeriesCategories = async (req, res) => {
 try {
    const { series_id } = req.query;

    if (!series_id) {
      return res.status(400).json({ error: 'series_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/series/categories`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_id
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

const getSeriesObservations = async (req, res) => {
 
    try {
    const { series_id } = req.query;

    if (!series_id) {
      return res.status(400).json({ error: 'series_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/series/observations`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_id
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

const getSeriesRelease = async (req, res) => {
   try {
    const { series_id } = req.query;

    if (!series_id) {
      return res.status(400).json({ error: 'series_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/series/release`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_id
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
const searchSeries = async (req, res) => {
     try {
    const { search_text } = req.query;

    if (!search_text) {
      return res.status(400).json({ error: 'search_text is required' });
    }

    const response = await axios.get(`${BASE_URL}/series/search`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        search_text
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchSeriesTags = async (req, res) => {
  try {
    const { series_search_text } = req.query;

    if (!series_search_text) {
      return res.status(400).json({ error: 'search_text is required' });
    }

    const response = await axios.get(`${BASE_URL}/series/search/tags`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_search_text
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const searchSeriesRelatedTags = async (req, res) => {
  try {
    const { series_search_text, tag_names } = req.query;

    // validate both required params
    if (!series_search_text || !tag_names) {
      return res.status(400).json({ error: 'series_search_text and tag_names are required' });
    }

    const response = await axios.get(`${BASE_URL}/series/search/related_tags`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_search_text,
        tag_names,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSeriesTags = async (req, res) => {
  try {
    const { series_id } = req.query;

    if (!series_id) {
      return res.status(400).json({ error: 'series_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/series/tags`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_id,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getSeriesUpdates = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/series/updates`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSeriesVintageDates = async (req, res) => {
    try {
    const { series_id } = req.query;

    if (!series_id) {
      return res.status(400).json({ error: 'series_id is required' });
    }

    const response = await axios.get(`${BASE_URL}/series/vintagedates`, {
      params: {
        api_key: API_KEY,
        file_type: 'json',
        series_id
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSeries,
  getSeriesCategories,
  getSeriesObservations,
  getSeriesRelease,
  searchSeries,
  searchSeriesTags,
  searchSeriesRelatedTags,
  getSeriesTags,
  getSeriesUpdates,
  getSeriesVintageDates,
};
