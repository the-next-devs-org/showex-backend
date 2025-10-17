const tf = require("@tensorflow/tfjs");

/**
 * AI Prediction Service using TensorFlow.js
 * Generates trend forecasts based on sentiment and economic indicators
 */

class AIPredictionService {
  constructor() {
    this.model = null;
    this.isModelReady = false;
    this.initializeModel();
  }

  /**
   * Initialize a simple sequential model for trend prediction
   */
  async initializeModel() {
    try {
      console.log("Initializing AI Prediction Model...");

      // Create a simple sequential model
      this.model = tf.sequential({
        layers: [
          // Input layer: expects 10 features (sentiment scores, economic indicators)
          tf.layers.dense({
            inputShape: [10],
            units: 32,
            activation: "relu",
            kernelInitializer: "heNormal",
          }),
          // Hidden layer with dropout for regularization
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 16,
            activation: "relu",
            kernelInitializer: "heNormal",
          }),
          // Output layer: probability of currency rising (sigmoid for 0-1 range)
          tf.layers.dense({
            units: 1,
            activation: "sigmoid",
          }),
        ],
      });

      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "binaryCrossentropy",
        metrics: ["accuracy"],
      });

      // Initialize with synthetic training data
      await this.trainWithSyntheticData();

      this.isModelReady = true;
      console.log(
        "✅ AI Prediction Model initialized and trained successfully"
      );
    } catch (error) {
      console.error("Error initializing AI model:", error);
      this.isModelReady = false;
    }
  }

  /**
   * Train the model with synthetic data
   * In production, you would use real historical data
   */
  async trainWithSyntheticData() {
    // Generate synthetic training data
    const numSamples = 1000;
    const features = [];
    const labels = [];

    for (let i = 0; i < numSamples; i++) {
      // Generate random features representing:
      // [sentiment_score, inflation_rate, interest_rate, gdp_growth, unemployment,
      //  trade_balance, consumer_confidence, market_volatility, oil_price_change, stock_index]
      const feature = [
        Math.random() * 100, // sentiment score (0-100)
        Math.random() * 10, // inflation rate (0-10%)
        Math.random() * 5, // interest rate (0-5%)
        Math.random() * 5 - 1, // GDP growth (-1 to 4%)
        Math.random() * 15, // unemployment (0-15%)
        Math.random() * 2 - 1, // trade balance (-1 to 1 trillion)
        Math.random() * 100, // consumer confidence (0-100)
        Math.random() * 50, // market volatility (0-50)
        Math.random() * 20 - 10, // oil price change (-10 to 10%)
        Math.random() * 10 - 5, // stock index change (-5 to 5%)
      ];

      // Simple logic: currency tends to rise with positive sentiment, low inflation,
      // high interest rates, positive GDP growth, and low unemployment
      const score =
        (feature[0] * 0.3 + // sentiment weight
          (10 - feature[1]) * 5 + // inflation (inverse)
          feature[2] * 10 + // interest rate
          (feature[3] + 1) * 15 + // GDP growth
          (15 - feature[4]) * 3 + // unemployment (inverse)
          (feature[5] + 1) * 5 + // trade balance
          feature[6] * 0.2 + // consumer confidence
          (50 - feature[7]) * 0.3 + // volatility (inverse)
          (feature[8] + 10) * 2 + // oil price
          (feature[9] + 5) * 3) / // stock index
        500;

      features.push(feature);
      labels.push(score > 0.5 ? 1 : 0); // Binary: will rise (1) or not (0)
    }

    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels, [numSamples, 1]);

    // Train the model (quick training for demo purposes)
    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(
              `  Epoch ${epoch}: loss = ${logs.loss.toFixed(
                4
              )}, accuracy = ${logs.acc.toFixed(4)}`
            );
          }
        },
      },
    });

    console.log("  Training completed!");

    // Clean up tensors
    xs.dispose();
    ys.dispose();
  }

  /**
   * Generate prediction for a currency based on current indicators
   * @param {string} currency - Currency code (e.g., 'USD', 'EUR')
   * @param {Object} indicators - Economic and sentiment indicators
   * @returns {Object} Prediction result with probability and confidence
   */
  async predictTrend(currency, indicators = {}) {
    if (!this.isModelReady) {
      throw new Error("AI Model is not ready yet");
    }

    try {
      // Extract or generate features from indicators
      const features = this.prepareFeatures(currency, indicators);

      // Convert to tensor
      const inputTensor = tf.tensor2d([features]);

      // Make prediction
      const prediction = this.model.predict(inputTensor);
      const probabilityTensor = await prediction.data();
      const probability = probabilityTensor[0] * 100; // Convert to percentage

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Determine confidence level based on probability distance from 50%
      const confidence = this.calculateConfidence(probability);

      // Generate trend direction
      const trend = probability >= 50 ? "rising" : "falling";

      // Add some randomness to make it more realistic (±5%)
      const adjustedProbability = Math.min(
        100,
        Math.max(0, probability + (Math.random() * 10 - 5))
      );

      return {
        currency,
        probability: Math.round(adjustedProbability),
        trend,
        confidence,
        timestamp: new Date().toISOString(),
        indicators: features,
      };
    } catch (error) {
      console.error("Prediction error:", error);
      throw error;
    }
  }

  /**
   * Prepare features from indicators
   */
  prepareFeatures(currency, indicators) {
    // If specific indicators are provided, use them; otherwise generate synthetic ones
    return [
      indicators.sentimentScore || Math.random() * 40 + 30, // 30-70
      indicators.inflationRate || Math.random() * 4 + 1, // 1-5%
      indicators.interestRate || Math.random() * 3 + 1, // 1-4%
      indicators.gdpGrowth || Math.random() * 3 - 0.5, // -0.5 to 2.5%
      indicators.unemployment || Math.random() * 5 + 3, // 3-8%
      indicators.tradeBalance || Math.random() * 0.4 - 0.2, // -0.2 to 0.2
      indicators.consumerConfidence || Math.random() * 30 + 50, // 50-80
      indicators.marketVolatility || Math.random() * 20 + 10, // 10-30
      indicators.oilPriceChange || Math.random() * 10 - 5, // -5 to 5%
      indicators.stockIndexChange || Math.random() * 4 - 2, // -2 to 2%
    ];
  }

  /**
   * Calculate confidence level based on probability
   */
  calculateConfidence(probability) {
    const distance = Math.abs(probability - 50);
    if (distance > 30) return "very-high";
    if (distance > 20) return "high";
    if (distance > 10) return "medium";
    return "low";
  }

  /**
   * Predict trends for multiple currencies
   */
  async predictMultipleCurrencies(currencies, indicators = {}) {
    if (!Array.isArray(currencies)) {
      currencies = ["USD", "EUR", "GBP", "JPY", "CHF"];
    }

    const predictions = [];
    for (const currency of currencies) {
      try {
        const prediction = await this.predictTrend(
          currency,
          indicators[currency] || {}
        );
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error predicting ${currency}:`, error);
      }
    }

    return predictions;
  }

  /**
   * Get model status
   */
  getModelStatus() {
    return {
      isReady: this.isModelReady,
      modelSummary: this.model
        ? "Sequential model with 3 layers"
        : "Not initialized",
    };
  }
}

// Create singleton instance
const aiPredictionService = new AIPredictionService();

module.exports = aiPredictionService;
