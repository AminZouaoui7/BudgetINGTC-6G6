const express = require('express');
const router = express.Router();
const { createBudget, getallbudgets, getbudgetbyid, updatebudget, deletebudget, addMemberToBudget, removeMemberFromBudget, setCategoryLimit } = require("../controllers/budgetcontroller");   
const { authenticateToken } = require('../middleware/authmiddleware');
const authorize = require('../middleware/authorize');

router.post('/create',authenticateToken,authorize("admin","user"), createBudget);
router.get('/getall', authenticateToken, getallbudgets);
router.get('/getallbyid/:id', authenticateToken, getbudgetbyid);
router.put('/update/:id', authenticateToken, authorize("admin","user"), updatebudget);
router.delete('/delete/:id', authenticateToken, authorize("admin","user"), deletebudget);

// Collaborative budget routes
router.post('/add-member/:id', authenticateToken, authorize("admin","user"), addMemberToBudget);
router.delete('/remove-member/:id/:userId', authenticateToken, authorize("admin","user"), removeMemberFromBudget);

// Category limit routes
router.post('/category-limits/:id', authenticateToken, authorize("admin","user"), setCategoryLimit);

module.exports = router