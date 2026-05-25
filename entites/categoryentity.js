const sequelize=require("../config/database")
const { DataTypes } = require("sequelize")
const Category=sequelize.define("Category",{
    name:{type:DataTypes.STRING,allowNull:false},
    description:{type:DataTypes.STRING,allowNull:true},
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
})
     
module.exports=Category