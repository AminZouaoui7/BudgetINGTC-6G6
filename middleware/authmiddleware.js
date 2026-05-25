  const jwt = require("jsonwebtoken")
const User = require("../entites/userentity")

 
// ── Verify JWT token ──────────────────────────────────────────────────────────
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." })
    }
 
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
 
    // Fetch fresh user from DB (catches deactivated accounts)
    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable." })
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "Compte non activé. Contactez l'administrateur." })
    }
 
    req.user = user // attach full user object to request
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré. Veuillez vous reconnecter." })
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide." })
    }
    return res.status(500).json({ message: error.message })
  }
}
module.exports = { authenticateToken: authenticate }