const express = require('express');
const router = express.Router();
const { register,login,getallusers,deleteuser,updateuser} = require("../controllers/usercontroller")
router.post("/register", register)
router.post("/login", login)
router.get("/getallusers", getallusers)
router.delete("/deleteuser/:id", deleteuser)
router.put("/updateuser/:id", updateuser)
module.exports = router 