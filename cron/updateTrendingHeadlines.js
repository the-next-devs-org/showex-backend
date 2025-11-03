import axios from 'axios';
import getTrendingHeadlines from '../Model/getTrendingHeadlines.js';
import { apiConfig } from '../config/api.js';
import trackApiCall from '../utils/trackApiCall.js';

const updateTrendingHeadlines = async () => {
  try {
    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/trending-headlines?page=1&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);
    const data = response.data.data || response.data || [];

    let existingRow = await getTrendingHeadlines.findOne();

    if (existingRow) {
      await existingRow.update({ api_response: data });
      console.log('Trending Headlines row updated');
    } else {
      await getTrendingHeadlines.create({ api_response: data });
      console.log('Trending Headlines row created');
    }

    await trackApiCall('getTrendingHeadlines');

  } catch (error) {
    console.error('Error updating Trending Headlines:', error.message);
  }
};

// setInterval(updateTrendingHeadlines, 150000);
setInterval(updateTrendingHeadlines, 300000); // 5 minutes

