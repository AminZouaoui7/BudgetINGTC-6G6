const sequelize = require("../config/database")
const { DataTypes } = require("sequelize")
const BudgetMember = sequelize.define("BudgetMember", {
  role: {
    type: DataTypes.ENUM("owner", "member", "viewer"),
    allowNull: false,
    defaultValue: "member",
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  budgetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

module.exports = BudgetMember