import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const getSundownDigest = sequelize.define('getSundownDigest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  api_response: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: true,
});

export default getSundownDigest;
