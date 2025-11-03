import axios from 'axios';
import getAllEvents from '../Model/getAllEvents.js';
import { apiConfig } from '../config/api.js';
import trackApiCall from '../utils/trackApiCall.js';

const updateAllEvents = async () => {
  try {
    const page = 1;
    const cache = true;

    const { FOREX_API_BASE_URL, FOREX_API_token_BASE_URL } = apiConfig;
    const url = `${FOREX_API_BASE_URL}/events?page=${page}&cache=${cache}&token=${FOREX_API_token_BASE_URL}`;

    const response = await axios.get(url);
    const data = response.data || {};

    let existingRow = await getAllEvents.findOne();

    if (existingRow) {
      await existingRow.update({ api_response: data });
      console.log('Events row updated');
    } else {
      await getAllEvents.create({ api_response: data });
      console.log('Events row created');
    }

    await trackApiCall('getAllEvents');

  } catch (error) {
    console.error('Error updating Events:', error.message);
  }
};

// 2 min 30 sec interval
// setInterval(updateAllEvents, 150000);
// setInterval(updateAllEvents, 4 * 60 * 60 * 1000);
// setInterval(updateAllEvents, 1394000); // 23 min 14 sec
// setInterval(updateAllEvents, 4 * 60 * 60 * 1000);
setInterval(updateAllEvents, 8 * 60 * 60 * 1000); // 8 ghante


