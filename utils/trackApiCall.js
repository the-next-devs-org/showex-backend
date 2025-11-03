// utils/trackApiCall.js (ESM syntax)
import ApiCallLog from '../Model/ApiCallLog.js';
import { Op } from 'sequelize';

export default async function trackApiCall(functionName) {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const existing = await ApiCallLog.findOne({
    where: {
      function_name: functionName,
      last_called_at: { [Op.gt]: last24Hours }
    }
  });

  if (existing) {
    existing.count += 1;
    existing.last_called_at = now;
    await existing.save();
  } else {
    await ApiCallLog.create({
      function_name: functionName,
      count: 1,
      last_called_at: now
    });
  }
}
