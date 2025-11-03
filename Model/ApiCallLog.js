// models/ApiCallLog.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // apna db connection import karo

const ApiCallLog = sequelize.define('ApiCallLog', {
  function_name: DataTypes.STRING,
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_called_at: DataTypes.DATE
});

export default ApiCallLog;
