const { Comment, Transaction } = require("../entites/associations")

// GET /transactions/:transactionId/comments
const getComments = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.transactionId)
    if (!transaction) return res.status(404).json({ message: "Transaction not found" })

    const comments = await Comment.findAll({
      where: { transactionId: req.params.transactionId },
      order: [["createdAt", "ASC"]],
    })
    res.status(200).json({ comments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /transactions/:transactionId/comments
const createComment = async (req, res) => {
  try {
    const { content } = req.body
    if (!content) return res.status(400).json({ message: "Content is required" })

    const transaction = await Transaction.findByPk(req.params.transactionId)
    if (!transaction) return res.status(404).json({ message: "Transaction not found" })

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      transactionId: transaction.id,
    })
    res.status(201).json({ message: "Comment added", comment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id)
    if (!comment) return res.status(404).json({ message: "Comment not found" })
    if (comment.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }
    await comment.destroy()
    res.status(200).json({ message: "Comment deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getComments, createComment, deleteComment }