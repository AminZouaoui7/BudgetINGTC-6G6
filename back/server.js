const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const sequelize = require('./config/database');
require("./entites/associations")
const { ensureDefaultCategories } = require("./services/defaultCategoryService")
const { syncAllBudgets } = require("./services/budgetAlertService")

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));
app.use(express.json()) //envoyer et recevoire body json
const userroute = require("./routs/userroute")
app.use("/user", userroute)
const categoryroute = require("./routs/categoryroute")
app.use("/category", categoryroute)
const budgetroute = require("./routs/budgetroute")
app.use("/budget", budgetroute)
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
  .then(async () => {
    console.log("Tables créées");
    try {
      await sequelize.query('ALTER TABLE "Categories" ALTER COLUMN "userId" DROP NOT NULL;');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la contrainte "Categories.userId" :', error);
    }
    return ensureDefaultCategories();
  })
  .then(async () => {
    console.log("Catégories par défaut prêtes.");
    await syncAllBudgets()
    console.log("Alertes budget synchronisées.");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Erreur :", error);
  });
