import axios from 'axios';
import getCurrencyPairNewsInclude from '../Model/getCurrencyPairNewsInclude.js';
import { apiConfig } from '../config/api.js';
import trackApiCall from '../utils/trackApiCall.js';

const updateCurrencyPairNewsInclude = async () => {
  try {
    const currencypairInclude = "EUR-USD,GBP-USD";
    const items = 50;
    const page = 1;

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}?currencypair-include=${currencypairInclude}&items=${items}&page=${page}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);
    const data = response?.data?.data || [];

    // DB me existing row fetch
    let existingRow = await getCurrencyPairNewsInclude.findOne();

    if (existingRow) {
      await existingRow.update({ api_response: data });
      console.log('Currency Pair (Include) news row updated');
    } else {
      await getCurrencyPairNewsInclude.create({ api_response: data });
      console.log('Currency Pair (Include) news row created');
    }

    await trackApiCall('getCurrencyPairNewsInclude');

  } catch (error) {
    console.error('Error updating Currency Pair (Include) news:', error.message);
  }
};

// 2 min 30 sec interval
// setInterval(updateCurrencyPairNewsInclude, 150000);
// Cron interval: 5 minutes
// setInterval(updateCurrencyPairNewsInclude, 5 * 60 * 1000);
setInterval(updateCurrencyPairNewsInclude, 10 * 60 * 1000); // 10 minutes


