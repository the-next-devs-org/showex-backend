const mongoose = require("mongoose");

/**
 * Schema for AI Predictions
 * Stores historical predictions for trend analysis and tracking
 */
const predictionSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    trend: {
      type: String,
      enum: ["rising", "falling"],
      required: true,
    },
    confidence: {
      type: String,
      enum: ["low", "medium", "high", "very-high"],
      required: true,
    },
    indicators: {
      type: [Number],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Optional: Store actual outcome for model validation
    actualOutcome: {
      type: String,
      enum: ["correct", "incorrect", "pending"],
      default: "pending",
    },
    // User who requested the prediction (optional)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
predictionSchema.index({ currency: 1, timestamp: -1 });

// Instance method to calculate accuracy
predictionSchema.methods.validatePrediction = function (actualTrend) {
  if (this.trend === actualTrend) {
    this.actualOutcome = "correct";
  } else {
    this.actualOutcome = "incorrect";
  }
  return this.save();
};

// Static method to get recent predictions for a currency
predictionSchema.statics.getRecentPredictions = function (
  currency,
  limit = 10
) {
  return this.find({ currency }).sort({ timestamp: -1 }).limit(limit).lean();
};

// Static method to get prediction accuracy for a currency
predictionSchema.statics.getAccuracy = async function (currency) {
  const predictions = await this.find({
    currency,
    actualOutcome: { $in: ["correct", "incorrect"] },
  });

  if (predictions.length === 0) {
    return { accuracy: 0, total: 0, correct: 0 };
  }

  const correct = predictions.filter(
    (p) => p.actualOutcome === "correct"
  ).length;
  const accuracy = (correct / predictions.length) * 100;

  return {
    accuracy: Math.round(accuracy),
    total: predictions.length,
    correct,
  };
};

// Static method to get all predictions within a date range
predictionSchema.statics.getPredictionsByDateRange = function (
  startDate,
  endDate,
  currency = null
) {
  const query = {
    timestamp: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  if (currency) {
    query.currency = currency;
  }

  return this.find(query).sort({ timestamp: -1 }).lean();
};

const Prediction = mongoose.model("Prediction", predictionSchema);

module.exports = Prediction;
