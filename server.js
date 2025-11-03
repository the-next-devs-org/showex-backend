require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");

require('./cron/updateForexNews.js');
require('./cron/updateSundownDigest.js');
require('./cron/updateTrendingHeadlines.js');
require('./cron/updateCurrencyPairNewsInclude.js');
require('./cron/updateSentimentAnalysis.js');
require('./cron/updateAllEvents.js');
require('./cron/updateCategoryAllCurrencyPairs.js');

const registerRoute = require("./routes/registerRoute");
const currencyRoutes = require("./routes/currencyRoutes");
const fredRoutes = require("./routes/fredCategoriesRoutes");
const fredReleaseRoutes = require("./routes/fredReleasesRoutes");
const fredSeriesRoutes = require("./routes/fredSeriesRoutes");
const fredSourcesRoutes = require("./routes/fredSourcesRoutes");
const fredTagsRoutes = require("./routes/fredTagsRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const indicatorRoutes = require('./routes/indicatorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const ipDateRoutes = require('./routes/ipDateRoutes');

const cron = require('node-cron');
const { getNegativeSentimentAndNotify } = require('./controllers/currencyController');

const app = express();
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api", fredTagsRoutes);
app.use("/api", fredSourcesRoutes);
app.use("/api", fredSeriesRoutes);
app.use("/api", fredReleaseRoutes);
app.use(`/api`, fredRoutes);
app.use("/api", registerRoute);
app.use("/api", currencyRoutes);
app.use("/api/predictions", predictionRoutes);
app.use('/api/indicators', indicatorRoutes);
app.use('/api/notications', notificationRoutes);
app.use('/api/ipdate', ipDateRoutes);


app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT;

// cron.schedule('*/15 * * * *', async () => {
//   console.log('Cron job running at', new Date());
//   try {
//     // Pass empty objects as req and res since it's not a real HTTP request
//     await getNegativeSentimentAndNotify({
//       query: {
//         section: "allcurrencypairs",
//         items: 50,
//         page: 1
//       }
//     }, {
//       json: () => {},
//       status: () => ({ json: () => {} })
//     });
//     console.log('✅ getNegativeSentimentAndNotify executed successfully');
//   } catch (err) {
//     console.error('❌ Error executing function:', err.message);
//   }
// });

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected");
    await sequelize.sync();
    console.log("✅ MySQL Tables synced (including predictions table)");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server failed:", err);
  }
})();
