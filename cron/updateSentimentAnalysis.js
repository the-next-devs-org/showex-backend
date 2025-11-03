import axios from 'axios';
import getSentimentAnalysis from '../Model/getSentimentAnalysis.js';
import { apiConfig } from '../config/api.js';
import trackApiCall from '../utils/trackApiCall.js';

const updateSentimentAnalysis = async () => {
  try {
    const currencypair = "EUR-USD";
    const date = "last30days";
    const page = 1;

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/stat?currencypair=${encodeURIComponent(currencypair)}&date=${encodeURIComponent(date)}&page=${page}&token=${encodeURIComponent(FOREX_API_token_BASE_URL)}`;

    const response = await axios.get(url);
    const data = response.data || {};

    // DB me existing row fetch karo
    let existingRow = await getSentimentAnalysis.findOne();

    if (existingRow) {
      await existingRow.update({ api_response: data });
      console.log('Sentiment Analysis row updated');
    } else {
      await getSentimentAnalysis.create({ api_response: data });
      console.log('Sentiment Analysis row created');
    }

    await trackApiCall('getSentimentAnalysis');

  } catch (error) {
    console.error('Error updating Sentiment Analysis:', error.message);
  }
};

// 2 min 30 sec interval
// setInterval(updateSentimentAnalysis, 150000);
// setInterval(updateSentimentAnalysis, 1 * 60 * 60 * 1000);
// setInterval(updateSentimentAnalysis, 1394000); // 23 min 14 sec
// setInterval(updateSentimentAnalysis, 1 * 60 * 60 * 1000);
setInterval(updateSentimentAnalysis, 2 * 60 * 60 * 1000); // 2 hours

