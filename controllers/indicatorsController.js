// src/controllers/indicatorController.js
require('dotenv').config();
const axios = require('axios');

const FRED_API_URL = process.env.FRED_API_URL || 'https://api.stlouisfed.org/fred/series/observations';
const FRED_API_KEY = process.env.FRED_API_KEY;
const POLL_MS = parseInt(process.env.FRED_POLL_MS, 10) || 3 * 60 * 1000; // default 3 minutes
const REQUEST_TIMEOUT = 15000; // 15s

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

// -------------------- Low-level fetch --------------------
async function fetchFredObservations(seriesId, opts = {}) {
  const params = {
    series_id: seriesId,
    api_key: FRED_API_KEY,
    file_type: 'json',
  };
  if (opts.limit) params.limit = opts.limit;
  if (opts.observation_start) params.observation_start = opts.observation_start;
  if (opts.observation_end) params.observation_end = opts.observation_end;

  const response = await axios.get(FRED_API_URL, { params, timeout: REQUEST_TIMEOUT });
  if (!response.data || !response.data.observations) {
    throw new Error('Invalid response from FRED API');
  }
  return response.data.observations;
}

// -------------------- In-memory cache --------------------
let cache = {
  indicators: null, // array of { seriesId, name, latest | error }
  timestamp: null,
  error: null,
};

function getCachedIndicators() {
  return cache;
}

// -------------------- Helper fetches --------------------
async function fetchLatestForIndicator(indicator) {
  try {
    const obs = await fetchFredObservations(indicator.id, { limit: 1 });
    const latest = obs?.[obs.length - 1] || null;
    return { seriesId: indicator.id, name: indicator.name, latest };
  } catch (err) {
    return { seriesId: indicator.id, name: indicator.name, error: err.message || String(err) };
  }
}

async function fetchAllIndicatorsParallel() {
  const promises = MAIN_INDICATORS.map(i => fetchLatestForIndicator(i));
  const results = await Promise.all(promises);
  return results;
}

// -------------------- Background updater --------------------
// startIndicatorUpdater(io) -> returns stop() function
function startIndicatorUpdater(io) {
  let stopped = false;

  async function doFetchAndEmit() {
    try {
      // If you want to clear old data immediately when fetch starts, uncomment:
      // cache = { indicators: null, timestamp: null, error: null };

      const indicators = await fetchAllIndicatorsParallel();
      cache = { indicators, timestamp: new Date().toISOString(), error: null };

      if (io && typeof io.emit === 'function') {
        io.emit('fred:indicators', cache);
      }

      console.log(`[indicatorUpdater] fetched ${indicators.length} indicators @ ${cache.timestamp}`);
    } catch (err) {
      console.error('[indicatorUpdater] fetch error:', err.message || err);
      // Default: keep last good snapshot, set error
      cache.error = err.message || String(err);
      // If you prefer to clear cache on error, uncomment next line:
      // cache = { indicators: null, timestamp: null, error: err.message || String(err) };

      if (io && typeof io.emit === 'function') {
        io.emit('fred:error', { message: cache.error, timestamp: new Date().toISOString() });
      }
    }
  }

  // immediate fetch + schedule
  doFetchAndEmit();
  const id = setInterval(() => { if (!stopped) doFetchAndEmit(); }, POLL_MS);

  return function stop() {
    stopped = true;
    clearInterval(id);
  };
}

// -------------------- HTTP handlers --------------------
async function listIndicators(req, res) {
  try {
    const cached = getCachedIndicators();
    if (cached && cached.indicators) {
      return res.json({ indicators: cached.indicators, timestamp: cached.timestamp, source: 'cache' });
    }

    // Fallback: if cache not ready (server start), fetch once
    const indicators = await fetchAllIndicatorsParallel();
    const timestamp = new Date().toISOString();
    cache = { indicators, timestamp, error: null };
    return res.json({ indicators, timestamp, source: 'fresh' });
  } catch (err) {
    console.error('listIndicators error (fallback):', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}

async function history(req, res) {
  try {
    const { seriesId } = req.params;
    if (!seriesId) return res.status(400).json({ error: 'seriesId is required' });

    const options = {
      limit: parseInt(req.query.limit || '200', 10),
      observation_start: req.query.start,
      observation_end: req.query.end,
    };

    const observations = await fetchFredObservations(seriesId, options);
    return res.json({ seriesId, observations });
  } catch (err) {
    console.error('history error:', err);
    if (err.response?.status === 404) return res.status(404).json({ error: 'Series not found on FRED' });
    return res.status(500).json({ error: err.message || String(err) });
  }
}

module.exports = {
  listIndicators,
  history,
  startIndicatorUpdater,
  getCachedIndicators,
  fetchAllIndicatorsParallel,
  MAIN_INDICATORS,
};
