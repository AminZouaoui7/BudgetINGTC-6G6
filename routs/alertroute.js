const express = require("express");
const router = express.Router();
const { getAlerts, markAsRead, markAllAsRead, deleteAlert } = require("../controllers/alertcontroller");
const { authenticateToken } = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");

router.get("/", authenticateToken, authorize("admin", "user"), getAlerts);
router.put("/read-all", authenticateToken, authorize("admin", "user"), markAllAsRead);
router.put("/:id/read", authenticateToken, authorize("admin", "user"), markAsRead);
router.delete("/:id", authenticateToken, authorize("admin", "user"), deleteAlert);

module.exports = router;
