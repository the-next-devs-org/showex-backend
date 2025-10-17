const express = require("express");
const router = express.Router();
const predictionController = require("../controllers/predictionController");

/**
 * AI Prediction Routes
 * Base path: /api/predictions
 */

// Get AI model status
router.get("/status", predictionController.getModelStatus);

// Get default predictions for common currencies
router.get("/default", predictionController.getDefaultPredictions);

// Get recent predictions for a specific currency
router.get("/recent/:currency", predictionController.getRecentPredictions);

// Get prediction history within date range
router.get("/history", predictionController.getPredictionHistory);

// Get prediction accuracy for a currency
router.get("/accuracy/:currency", predictionController.getPredictionAccuracy);

// Generate prediction for a single currency
router.post("/predict", predictionController.getPrediction);

// Generate predictions for multiple currencies
router.post("/predict-multiple", predictionController.getMultiplePredictions);

// Validate a prediction with actual outcome
router.put("/validate/:id", predictionController.validatePrediction);

module.exports = router;
