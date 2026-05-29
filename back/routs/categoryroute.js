const express = require('express');
const router = express.Router();
const { createCategory,getallcategories, getcategorybyid, updatecategory, deletecategory } = require("../controllers/categorycontroller")
const { authenticateToken } = require("../middleware/authmiddleware");
const authorize = require('../middleware/authorize');
router.post("/create", authenticateToken, authorize("admin","user"), createCategory)
router.get("/getall", authenticateToken, authorize("admin","user"), getallcategories)
router.get("/getbyid/:id", authenticateToken, authorize("admin","user"), getcategorybyid)
router.put("/update/:id", authenticateToken, authorize("admin","user"), updatecategory)
router.delete("/delete/:id", authenticateToken, authorize("admin","user"), deletecategory)
module.exports = router