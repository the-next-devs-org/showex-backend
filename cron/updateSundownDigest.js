import axios from 'axios';
import getSundownDigest from '../Model/getSundownDigest.js';
import { apiConfig } from '../config/api.js';
import trackApiCall from '../utils/trackApiCall.js';

const updateSundownDigest = async () => {
  try {
    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/sundown-digest?page=1&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);
    const data = response.data.data || response.data || [];

    let existingRow = await getSundownDigest.findOne();

    if (existingRow) {
      await existingRow.update({ api_response: data });
      console.log('Sundown Digest row updated');
    } else {
      await getSundownDigest.create({ api_response: data });
      console.log('Sundown Digest row created');
    }

    await trackApiCall('getSundownDigest');

  } catch (error) {
    console.error('Error updating Sundown Digest:', error.message);
  }
};

// 2 min 30 sec interval
// setInterval(updateSundownDigest, 150000);
// setInterval(updateSundownDigest, 1 * 60 * 60 * 1000);
// setInterval(updateSundownDigest, 1394000); // 23 min 14 sec
// setInterval(updateSundownDigest, 12 * 60 * 60 * 1000);
setInterval(updateSundownDigest, 24 * 60 * 60 * 1000); // 24 hours

