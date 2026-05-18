const express = require('express');
const router = express.Router();
const { createCategory,getallcategories, getcategorybyid, updatecategory, deletecategory } = require("../controllers/categorycontroller")
const { authenticateToken } = require("../middleware/authmiddleware");
const authorize = require('../middleware/authorize');
router.post("/create", authenticateToken,authorize("admin"), createCategory)
router.get("/getall",getallcategories)
router.get("/getbyid/:id",getcategorybyid)
router.put("/update/:id", authenticateToken, authorize("admin"), updatecategory)
router.delete("/delete/:id", authenticateToken, authorize("admin"), deletecategory)
module.exports = router