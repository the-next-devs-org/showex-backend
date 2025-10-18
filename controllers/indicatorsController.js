
require('dotenv').config();
const axios = require('axios');

const FRED_API_URL = process.env.FRED_API_URL || 'https://api.stlouisfed.org/fred/series/observations';
const FRED_API_KEY = process.env.FRED_API_KEY;

if (!FRED_API_KEY) {
  console.warn('Warning: FRED_API_KEY not set in .env file');
}

const MAIN_INDICATORS = [
  { id: 'GDP', name: 'Gross Domestic Product' },
  { id: 'CPIAUCSL', name: 'CPI (Inflation)' },
  { id: 'UNRATE', name: 'Unemployment Rate' },
  { id: 'FEDFUNDS', name: 'Federal Funds Rate' },
  { id: 'INDPRO', name: 'Industrial Production' }
];

async function fetchFredObservations(seriesId, opts = {}) {
  const params = {
    series_id: seriesId,
    api_key: FRED_API_KEY,
    file_type: 'json',
  };
  if (opts.limit) params.limit = opts.limit;
  if (opts.observation_start) params.observation_start = opts.observation_start;
  if (opts.observation_end) params.observation_end = opts.observation_end;

  const response = await axios.get(FRED_API_URL, { params, timeout: 15000 });
  if (!response.data || !response.data.observations) {
    throw new Error('Invalid response from FRED API');
  }
  return response.data.observations;
}

async function listIndicators(req, res) {
  try {
    const results = [];

    for (const indicator of MAIN_INDICATORS) {
      try {
        const observations = await fetchFredObservations(indicator.id, { limit: 1 });
        const latest = observations?.[observations.length - 1] || null;

        results.push({
          seriesId: indicator.id,
          name: indicator.name,
          latest, 
        });

        await new Promise((r) => setTimeout(r, 100));
      } catch (err) {
        results.push({
          seriesId: indicator.id,
          name: indicator.name,
          error: err.message,
        });
      }
    }

    res.json({ indicators: results });
  } catch (err) {
    console.error('listIndicators error:', err);
    res.status(500).json({ error: err.message });
  }
}

async function history(req, res) {
  try {
    const { seriesId } = req.params;
    if (!seriesId) {
      return res.status(400).json({ error: 'seriesId is required' });
    }

    const options = {
      limit: parseInt(req.query.limit || '200', 10),
      observation_start: req.query.start,
      observation_end: req.query.end,
    };

    const observations = await fetchFredObservations(seriesId, options);
    res.json({ seriesId, observations });
  } catch (err) {
    console.error('history error:', err);
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'Series not found on FRED' });
    }
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listIndicators,
  history,
};
