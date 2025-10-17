const aiPredictionService = require("../services/aiPredictionService");
const Prediction = require("../Model/predictionModelSQL");

/**
 * AI Prediction Controller
 * Handles requests for AI-powered trend predictions
 */

/**
 * Get prediction for a single currency
 * POST /api/predictions/predict
 * Body: { currency: 'USD', indicators: {...} }
 */
exports.getPrediction = async (req, res) => {
  try {
    const { currency, indicators } = req.body;

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: "Currency is required",
      });
    }

    // Generate prediction using AI service
    const prediction = await aiPredictionService.predictTrend(
      currency.toUpperCase(),
      indicators || {}
    );

    // Save prediction to database
    const savedPrediction = await Prediction.create({
      currency: prediction.currency,
      probability: prediction.probability,
      trend: prediction.trend,
      confidence: prediction.confidence,
      indicators: prediction.indicators,
    });

    res.status(200).json({
      success: true,
      data: savedPrediction,
    });
  } catch (error) {
    console.error("Error in getPrediction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate prediction",
      error: error.message,
    });
  }
};

/**
 * Get predictions for multiple currencies
 * POST /api/predictions/predict-multiple
 * Body: { currencies: ['USD', 'EUR', 'GBP'], indicators: {...} }
 */
exports.getMultiplePredictions = async (req, res) => {
  try {
    const { currencies, indicators } = req.body;

    if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Currencies array is required",
      });
    }

    // Generate predictions for all currencies
    const predictions = await aiPredictionService.predictMultipleCurrencies(
      currencies,
      indicators || {}
    );

    // Save all predictions to database
    const savedPredictions = await Prediction.bulkCreate(
      predictions.map((pred) => ({
        currency: pred.currency,
        probability: pred.probability,
        trend: pred.trend,
        confidence: pred.confidence,
        indicators: pred.indicators,
      }))
    );

    res.status(200).json({
      success: true,
      data: savedPredictions,
    });
  } catch (error) {
    console.error("Error in getMultiplePredictions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate predictions",
      error: error.message,
    });
  }
};

/**
 * Get recent predictions for a currency
 * GET /api/predictions/recent/:currency?limit=10
 */
exports.getRecentPredictions = async (req, res) => {
  try {
    const { currency } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: "Currency is required",
      });
    }

    const predictions = await Prediction.getRecentPredictions(
      currency.toUpperCase(),
      limit
    );

    res.status(200).json({
      success: true,
      data: predictions,
      count: predictions.length,
    });
  } catch (error) {
    console.error("Error in getRecentPredictions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent predictions",
      error: error.message,
    });
  }
};

/**
 * Get prediction history within date range
 * GET /api/predictions/history?startDate=...&endDate=...&currency=USD
 */
exports.getPredictionHistory = async (req, res) => {
  try {
    const { startDate, endDate, currency } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const predictions = await Prediction.getPredictionsByDateRange(
      startDate,
      endDate,
      currency ? currency.toUpperCase() : null
    );

    res.status(200).json({
      success: true,
      data: predictions,
      count: predictions.length,
    });
  } catch (error) {
    console.error("Error in getPredictionHistory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prediction history",
      error: error.message,
    });
  }
};

/**
 * Get prediction accuracy for a currency
 * GET /api/predictions/accuracy/:currency
 */
exports.getPredictionAccuracy = async (req, res) => {
  try {
    const { currency } = req.params;

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: "Currency is required",
      });
    }

    const accuracy = await Prediction.getAccuracy(currency.toUpperCase());

    res.status(200).json({
      success: true,
      data: accuracy,
    });
  } catch (error) {
    console.error("Error in getPredictionAccuracy:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate accuracy",
      error: error.message,
    });
  }
};

/**
 * Validate a prediction with actual outcome
 * PUT /api/predictions/validate/:id
 * Body: { actualTrend: 'rising' | 'falling' }
 */
exports.validatePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualTrend } = req.body;

    if (!actualTrend || !["rising", "falling"].includes(actualTrend)) {
      return res.status(400).json({
        success: false,
        message: "Valid actualTrend (rising or falling) is required",
      });
    }

    const prediction = await Prediction.findById(id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found",
      });
    }

    await prediction.validatePrediction(actualTrend);

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error("Error in validatePrediction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate prediction",
      error: error.message,
    });
  }
};

/**
 * Get AI model status
 * GET /api/predictions/status
 */
exports.getModelStatus = async (req, res) => {
  try {
    const status = aiPredictionService.getModelStatus();

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Error in getModelStatus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get model status",
      error: error.message,
    });
  }
};

/**
 * Get default predictions (auto-generate for common currencies)
 * GET /api/predictions/default
 */
exports.getDefaultPredictions = async (req, res) => {
  try {
    const defaultCurrencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD"];

    // Generate fresh predictions
    const predictions = await aiPredictionService.predictMultipleCurrencies(
      defaultCurrencies
    );

    // Save to database
    await Prediction.bulkCreate(
      predictions.map((pred) => ({
        currency: pred.currency,
        probability: pred.probability,
        trend: pred.trend,
        confidence: pred.confidence,
        indicators: pred.indicators,
      }))
    );

    res.status(200).json({
      success: true,
      data: predictions,
    });
  } catch (error) {
    console.error("Error in getDefaultPredictions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate default predictions",
      error: error.message,
    });
  }
};
