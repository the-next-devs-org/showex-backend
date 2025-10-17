require("dotenv").config();
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Prediction Model for MySQL/Sequelize
 * Stores AI predictions with history tracking
 */
const Prediction = sequelize.define(
  "Prediction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true,
        isUppercase: true,
      },
    },
    probability: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    trend: {
      type: DataTypes.ENUM("rising", "falling"),
      allowNull: false,
    },
    confidence: {
      type: DataTypes.ENUM("low", "medium", "high", "very-high"),
      allowNull: false,
    },
    indicators: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const raw = this.getDataValue("indicators");
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue("indicators", JSON.stringify(value));
      },
    },
    actualOutcome: {
      type: DataTypes.ENUM("correct", "incorrect", "pending"),
      defaultValue: "pending",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "predictions",
    timestamps: true,
    indexes: [
      {
        fields: ["currency"],
      },
      {
        fields: ["createdAt"],
      },
      {
        fields: ["currency", "createdAt"],
      },
    ],
  }
);

// Static methods
Prediction.getRecentPredictions = async function (currency, limit = 10) {
  return await this.findAll({
    where: { currency: currency.toUpperCase() },
    order: [["createdAt", "DESC"]],
    limit: limit,
    raw: true,
  });
};

Prediction.getAccuracy = async function (currency) {
  const predictions = await this.findAll({
    where: {
      currency: currency.toUpperCase(),
      actualOutcome: ["correct", "incorrect"],
    },
    raw: true,
  });

  if (predictions.length === 0) {
    return { accuracy: 0, total: 0, correct: 0 };
  }

  const correct = predictions.filter(
    (p) => p.actualOutcome === "correct"
  ).length;
  const accuracy = (correct / predictions.length) * 100;

  return {
    accuracy: Math.round(accuracy),
    total: predictions.length,
    correct,
  };
};

Prediction.getPredictionsByDateRange = async function (
  startDate,
  endDate,
  currency = null
) {
  const { Op } = require("sequelize");
  const where = {
    createdAt: {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    },
  };

  if (currency) {
    where.currency = currency.toUpperCase();
  }

  return await this.findAll({
    where,
    order: [["createdAt", "DESC"]],
    raw: true,
  });
};

// Instance method
Prediction.prototype.validatePrediction = async function (actualTrend) {
  this.actualOutcome = this.trend === actualTrend ? "correct" : "incorrect";
  return await this.save();
};

module.exports = Prediction;
