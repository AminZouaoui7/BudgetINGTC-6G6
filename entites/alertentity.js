const sequelize = require("../config/database")
const { DataTypes } = require("sequelize")

const Alert = sequelize.define("Alert", {
  type: {
    type: DataTypes.ENUM("threshold", "exceeded"),
    allowNull: false,
    // threshold = approaching limit, exceeded = over limit
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  budgetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // the user this alert is for
  },
})

module.exports = Alert