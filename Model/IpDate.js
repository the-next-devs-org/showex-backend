const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const IpDate = sequelize.define('IpDate', {
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true 
});

module.exports = IpDate;
