const Alert = require("../entites/alertentity")

// GET /alerts — current user's unread alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json({ alerts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /alerts/:id/read — mark an alert as read
const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id)
    if (!alert) return res.status(404).json({ message: "Alert not found" })
    if (alert.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" })

    await alert.update({ isRead: true })
    res.status(200).json({ message: "Alert marked as read", alert })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /alerts/read-all — mark all user alerts as read
const markAllAsRead = async (req, res) => {
  try {
    await Alert.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } })
    res.status(200).json({ message: "All alerts marked as read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /alerts/:id
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id)
    if (!alert) return res.status(404).json({ message: "Alert not found" })
    if (alert.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }
    await alert.destroy()
    res.status(200).json({ message: "Alert deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAlerts, markAsRead, markAllAsRead, deleteAlert }
