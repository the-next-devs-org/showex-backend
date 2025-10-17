/**
 * Test script for AI Prediction Service
 * Run with: node testAI.js
 */

const aiPredictionService = require("./services/aiPredictionService");

async function testAIPredictions() {
  console.log("🤖 Testing AI Prediction Service...\n");

  try {
    // Wait for model to initialize (training takes time)
    console.log("Waiting for model initialization...");
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

    // Check model status
    console.log("1. Model Status:");
    const status = aiPredictionService.getModelStatus();
    console.log(JSON.stringify(status, null, 2));
    console.log("\n");

    if (!status.isReady) {
      console.error(
        "❌ Model is still not ready. Please try again in a moment."
      );
      process.exit(1);
    }

    // Test single currency prediction
    console.log("2. Single Currency Prediction (USD):");
    const usdPrediction = await aiPredictionService.predictTrend("USD", {
      sentimentScore: 65,
      inflationRate: 2.5,
      interestRate: 3.0,
      gdpGrowth: 2.1,
      unemployment: 4.5,
    });
    console.log(JSON.stringify(usdPrediction, null, 2));
    console.log("\n");

    // Test multiple currencies prediction
    console.log("3. Multiple Currencies Prediction:");
    const currencies = ["USD", "EUR", "GBP", "JPY"];
    const predictions = await aiPredictionService.predictMultipleCurrencies(
      currencies
    );
    predictions.forEach((pred) => {
      console.log(
        `${pred.currency}: ${pred.probability}% probability of ${pred.trend} (${pred.confidence} confidence)`
      );
    });
    console.log("\n");

    // Test with custom indicators for EUR
    console.log("4. EUR Prediction with Custom Indicators:");
    const eurPrediction = await aiPredictionService.predictTrend("EUR", {
      sentimentScore: 72,
      inflationRate: 1.8,
      interestRate: 2.5,
      gdpGrowth: 1.9,
      unemployment: 6.2,
      tradeBalance: 0.15,
      consumerConfidence: 68,
      marketVolatility: 18,
      oilPriceChange: -2.1,
      stockIndexChange: 1.8,
    });
    console.log(JSON.stringify(eurPrediction, null, 2));
    console.log("\n");

    console.log("✅ All tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests
testAIPredictions();
