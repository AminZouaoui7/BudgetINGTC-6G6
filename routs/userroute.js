const express = require('express');
const router = express.Router();
const { register,login,getallusers,deleteuser,updateuser, activateUser} = require("../controllers/usercontroller");

const authorize = require('../middleware/authorize');
const { authenticateToken } = require('../middleware/authmiddleware');
router.post("/register", register)
router.post("/login", login)
router.get("/getallusers", authenticateToken, authorize("admin"), getallusers)
router.delete("/deleteuser/:id", authenticateToken, authorize("admin"), deleteuser)
router.put("/updateuser/:id", authenticateToken, authorize("admin"), updateuser)
router.put("/activateuser/:id", authenticateToken, authorize("admin"), activateUser)
module.exports = router 