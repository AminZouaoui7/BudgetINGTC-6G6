const Comment = require("../entites/commententity")
const Transaction = require("../entites/transactionentity")
const Budget = require("../entites/budgetentity")
const BudgetMember = require("../entites/budgetMemberentity")
const User = require("../entites/userentity")

const isAdmin = (req) => req.user?.role === "admin"

const resolveTransactionId = (req) =>
  req.params.transactionId || req.query.transactionId || req.body.transactionId

const canAccessTransaction = async (transaction, req) => {
  if (!transaction) {
    return false
  }

  if (isAdmin(req)) {
    return true
  }

  if (transaction.budgetId) {
    const budget = await Budget.findByPk(transaction.budgetId)
    if (!budget) {
      return false
    }

    if (budget.ownerId === req.user.id) {
      return true
    }

    const membership = await BudgetMember.findOne({
      where: {
        budgetId: transaction.budgetId,
        userId: req.user.id,
      },
    })

    return Boolean(membership)
  }

  return transaction.userId === req.user.id
}

const getComments = async (req, res) => {
  try {
    const transactionId = resolveTransactionId(req)
    if (!transactionId) {
      return res.status(400).json({ message: "transactionId is required" })
    }

    const transaction = await Transaction.findByPk(transactionId)
    if (!transaction) return res.status(404).json({ message: "Transaction not found" })
    if (!(await canAccessTransaction(transaction, req))) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const comments = await Comment.findAll({
      where: { transactionId: transaction.id },
      order: [["createdAt", "ASC"]],
      include: [{ model: User, as: "author", attributes: ["id", "fullName", "email"] }],
    })
    res.status(200).json({ message: "Comments retrieved successfully", comments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createComment = async (req, res) => {
  try {
    const { content } = req.body
    const transactionId = resolveTransactionId(req)

    if (!transactionId) {
      return res.status(400).json({ message: "transactionId is required" })
    }
    if (!content) return res.status(400).json({ message: "Content is required" })

    const transaction = await Transaction.findByPk(transactionId)
    if (!transaction) return res.status(404).json({ message: "Transaction not found" })
    if (!(await canAccessTransaction(transaction, req))) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const created = await Comment.create({
      content,
      userId: req.user.id,
      transactionId: transaction.id,
    })

    const comment = await Comment.findByPk(created.id, {
      include: [{ model: User, as: "author", attributes: ["id", "fullName", "email"] }],
    })

    res.status(201).json({ message: "Comment added", comment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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
