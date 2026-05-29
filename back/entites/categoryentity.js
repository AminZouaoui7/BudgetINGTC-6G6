const sequelize=require("../config/database")
const { DataTypes } = require("sequelize")
const Category=sequelize.define("Category",{
    name:{type:DataTypes.STRING,allowNull:false},
    description:{type:DataTypes.STRING,allowNull:true},
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false, defaultValue: 'expense' },
    color: { type: DataTypes.STRING, allowNull: true, defaultValue: '#3eb3f2' },
    icon: { type: DataTypes.STRING, allowNull: true, defaultValue: 'ShoppingCart' },
})
     
module.exports=Category
