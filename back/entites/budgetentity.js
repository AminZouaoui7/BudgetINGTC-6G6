const sequelize=require("../config/database")
const { DataTypes } = require("sequelize")
const Budget=sequelize.define("Budget",{
    name:{type:DataTypes.STRING,allowNull:false},
    amount:{type:DataTypes.FLOAT,allowNull:false},
    description:{type:DataTypes.STRING,allowNull:true},
    periodType:{type:DataTypes.ENUM('weekly','monthly', 'yearly'),allowNull:false},
    startDate:{type:DataTypes.DATE,allowNull:false},
    endDate:{type:DataTypes.DATE,allowNull:false}, 
    isshared: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})
module.exports=Budget