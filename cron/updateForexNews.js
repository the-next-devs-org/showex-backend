import axios from 'axios';
import getGeneralForexNews from '../Model/getGeneralForexNews.js';
import { apiConfig } from '../config/api.js';
import trackApiCall from '../utils/trackApiCall.js';

const updateGeneralForexNews = async () => {
  try {
    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/category?section=general&items=10&page=1&token=${FOREX_API_token_BASE_URL}`;
    
    const response = await axios.get(url);
    const data = response.data.data || response.data || [];

    let latestRow = await getGeneralForexNews.findOne();

    if (latestRow) {
      await latestRow.update({ api_response: data });
    } else {
      await getGeneralForexNews.create({ api_response: data });
    }

    await trackApiCall('getCategory');
    console.log('Forex news updated in DB');

  } catch (error) {
    console.error('Error updating Forex news:', error.message);
  }
};

// 2 min 30 sec interval
// setInterval(updateGeneralForexNews, 150000);
// setInterval(updateGeneralForexNews, 4 * 60 * 60 * 1000);
// setInterval(updateGeneralForexNews, 1394000); // 23 min 14 sec
// Cron interval: 30 minutes
// setInterval(updateGeneralForexNews, 30 * 60 * 1000);
setInterval(updateGeneralForexNews, 60 * 60 * 1000); // 60 minutes

