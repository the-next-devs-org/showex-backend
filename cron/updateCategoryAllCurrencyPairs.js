import axios from 'axios';
import getCategoryAllCurrencyPairs from '../Model/getCategoryAllCurrencyPairs.js';
import { apiConfig } from '../config/api.js';
import trackApiCall from '../utils/trackApiCall.js';

export const updateCategoryAllCurrencyPairs = async () => {
  try {
    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    // include items and page params — the upstream API may require them and return 422 otherwise
    const items = 50;
    const page = 1;
    const url = `${FOREX_API_BASE_URL}/category?section=allcurrencypairs&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;
    
    const response = await axios.get(url);
    // normalize response like other cron files
    const data = response.data?.data || response.data || [];

    const existingRow = await getCategoryAllCurrencyPairs.findOne();

    if (existingRow) {
      await existingRow.update({ api_response: data });
      console.log('All Currency Pairs row updated');
    } else {
      await getCategoryAllCurrencyPairs.create({ api_response: data });
      console.log('All Currency Pairs row created');
    }

    await trackApiCall('getCategoryAllCurrencyPairs');

  } catch (error) {
    // Show more details when the API responds with 4xx/5xx so it's easier to debug 422
    console.error('Error updating All Currency Pairs:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

// Cron interval: 2 min 30 sec
// setInterval(updateCategoryAllCurrencyPairs, 150000);
// setInterval(updateCategoryAllCurrencyPairs, 24 * 60 * 60 * 1000);
// setInterval(updateCategoryAllCurrencyPairs, 5 * 60 * 1000);
setInterval(updateCategoryAllCurrencyPairs, 10 * 60 * 1000); // 10 minutes

