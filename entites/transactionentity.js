const sequelize = require("../config/database")
const { DataTypes } = require("sequelize")
 
const Transaction = sequelize.define("Transaction", {
  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // FK references
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // the user who created this transaction
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  budgetId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null = personal transaction not linked to a budget
  },
})
 
module.exports = Transaction