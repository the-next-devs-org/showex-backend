const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notification: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  currencies: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

module.exports = Notification;
