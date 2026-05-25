const sequelize = require("../config/database")
const { DataTypes } = require("sequelize")

const BudgetCategory = sequelize.define("BudgetCategory", {
  limit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  budgetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

module.exports = BudgetCategory