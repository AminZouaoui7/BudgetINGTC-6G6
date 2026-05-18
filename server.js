const express = require('express');
const app = express()
const port = 3002
const sequelize = require('./config/database')
app.use(express.json()) //envoyer et recevoire body json
const dotenv=require("dotenv")
dotenv.config()
const userroute = require("./routs/userroute")
app.use("/user", userroute)
const categoryroute = require("./routs/categoryroute")
app.use("/category", categoryroute)
const budgetroute = require("./routs/budgetroute")
app.use("/budget", budgetroute)
require("./entites/associations")
const transactionroute = require("./routs/transactionroute")
app.use("/transaction", transactionroute)
const commentroute = require("./routs/commentroute")
app.use("/comment", commentroute)
const alertroute = require("./routs/alertroute")
app.use("/alert", alertroute)
sequelize.authenticate()
  .then(() => {
    console.log("Connexion PostgreSQL réussie.");

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Tables créées");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Erreur :", error);
  });



















app.listen(port)
