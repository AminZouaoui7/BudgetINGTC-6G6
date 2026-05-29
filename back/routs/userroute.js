const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getallusers,
  deleteuser,
  updateuser,
  activateUser,
  getCurrentUser,
  updateCurrentUser,
  changePassword,
} = require("../controllers/usercontroller");

const authorize = require('../middleware/authorize');
const { authenticateToken } = require('../middleware/authmiddleware');
router.post("/register", register)
router.post("/login", login)
router.get("/me", authenticateToken, authorize("admin","user"), getCurrentUser)
router.put("/me", authenticateToken, authorize("admin","user"), updateCurrentUser)
router.put("/change-password", authenticateToken, authorize("admin","user"), changePassword)
router.get("/getallusers", authenticateToken, authorize("admin","user"), getallusers)
router.delete("/deleteuser/:id", authenticateToken, authorize("admin"), deleteuser)
router.put("/updateuser/:id", authenticateToken, authorize("admin"), updateuser)
router.put("/activateuser/:id", authenticateToken, authorize("admin"), activateUser)
module.exports = router 
