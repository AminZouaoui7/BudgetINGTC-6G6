const sequelize=require("../config/database")
const { DataTypes } = require("sequelize")
const User=sequelize.define("User",{
    fullName:{type:DataTypes.STRING,allowNull:false},
    email:{type:DataTypes.STRING,allowNull:false},
    password:{type:DataTypes.STRING,allowNull:false},
    phoneNumber:{type:DataTypes.STRING,allowNull:false},
    address:{type:DataTypes.STRING,allowNull:false},
   role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // activé par l'admin via email
    },
})
module.exports=User
