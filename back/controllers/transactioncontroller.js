const Transaction = require("../entites/transactionentity")
const Budget = require("../entites/budgetentity")
const Category = require("../entites/categoryentity")
const User = require("../entites/userentity")
const { Op } = require("sequelize")
const BudgetMember = require("../entites/budgetMemberentity")
const { syncBudgetAlerts } = require("../services/budgetAlertService")

const isAdmin = (req) => req.user?.role === "admin"
const hasValue = (value) => value !== undefined && value !== null && value !== ""

const canAccessBudget = async (budgetId, req) => {
  const budget = await Budget.findByPk(budgetId)
  if (!budget) return null
  if (isAdmin(req)) return budget

  const isMember = await BudgetMember.findOne({
    where: { budgetId, userId: req.user.id },
  })

  if (budget.ownerId !== req.user.id && !isMember) return null
  return budget
}

const canAccessCategory = async (categoryId, req) => {
  const category = await Category.findByPk(categoryId)
  if (!category) return null
  if (isAdmin(req) || category.userId === req.user.id || category.userId == null) {
    return category
  }
  return null
}

const canAccessTransaction = async (transaction, req) => {
  if (!transaction) {
    return false
  }

  if (isAdmin(req)) {
    return true
  }

  if (transaction.budgetId) {
    const budget = await canAccessBudget(transaction.budgetId, req)
    return Boolean(budget)
  }

  return transaction.userId === req.user.id
}

const getAccessibleBudgetIds = async (userId) => {
  const ownedBudgets = await Budget.findAll({
    where: { ownerId: userId },
    attributes: ["id"],
  })

  const memberBudgets = await BudgetMember.findAll({
    where: { userId },
    attributes: ["budgetId"],
  })

  return [
    ...new Set([
      ...ownedBudgets.map((budget) => budget.id),
      ...memberBudgets.map((membership) => membership.budgetId),
    ]),
  ]
}

const transactionInclude = [
  { model: User, as: "author", attributes: ["id", "fullName", "email"] },
  { model: Category, as: "category" },
]

const createTransaction = async (req, res) => {
  try {
    const { amount, type, date, description, categoryId, budgetId } = req.body
    if (!amount || !type || !date) {
      return res.status(400).json({ message: "amount, type and date are required" })
    }

    if (budgetId) {
      const budget = await canAccessBudget(budgetId, req)
      if (!budget) {
        return res.status(403).json({ message: "You do not have access to this budget" })
      }
    }

    if (categoryId) {
      const category = await canAccessCategory(categoryId, req)
      if (!category) {
        return res.status(403).json({ message: "You do not have access to this category" })
      }
    }

    const created = await Transaction.create({
      amount,
      type,
      date,
      description,
      categoryId,
      budgetId,
      userId: req.user.id,
    })

    if (created.budgetId) {
      await syncBudgetAlerts(created.budgetId)
    }

    const transaction = await Transaction.findByPk(created.id, {
      include: transactionInclude,
    })

    res.status(201).json({ message: "Transaction created successfully", transaction })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate, categoryId } = req.query
    const accessibleBudgetIds = await getAccessibleBudgetIds(req.user.id)
    const conditions = [
      { userId: req.user.id },
      ...(accessibleBudgetIds.length > 0 ? [{ budgetId: { [Op.in]: accessibleBudgetIds } }] : []),
    ]

    const filters = {
      [Op.or]: conditions,
    }

    if (type) filters.type = type
    if (startDate && endDate) {
      filters.date = { [Op.between]: [startDate, endDate] }
    }
    if (categoryId) filters.categoryId = categoryId

    const transactions = await Transaction.findAll({
      where: filters,
      include: transactionInclude,
    })
    res.status(200).json({ message: "Transactions retrieved successfully", transactions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id
    const transaction = await Transaction.findByPk(transactionId)
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    if (!(await canAccessTransaction(transaction, req))) {
      return res.status(403).json({ message: "You do not have access to this transaction" })
    }

    const { amount, type, date, description, categoryId, budgetId } = req.body
    const previousBudgetId = transaction.budgetId

    if (hasValue(budgetId)) {
      const budget = await canAccessBudget(budgetId, req)
      if (!budget) {
        return res.status(403).json({ message: "You do not have access to this budget" })
      }
    }

    if (hasValue(categoryId)) {
      const category = await canAccessCategory(categoryId, req)
      if (!category) {
        return res.status(403).json({ message: "You do not have access to this category" })
      }
    }

    const nextValues = {}
    if (hasValue(amount)) nextValues.amount = amount
    if (hasValue(type)) nextValues.type = type
    if (hasValue(date)) nextValues.date = date
    if (description !== undefined) nextValues.description = description
    if (categoryId !== undefined) nextValues.categoryId = categoryId || null
    if (budgetId !== undefined) nextValues.budgetId = budgetId || null

    await transaction.update(nextValues)

    const impactedBudgetIds = [...new Set([previousBudgetId, transaction.budgetId].filter(Boolean))]
    for (const impactedBudgetId of impactedBudgetIds) {
      await syncBudgetAlerts(impactedBudgetId)
    }

    const updatedTransaction = await Transaction.findByPk(transactionId, {
      include: transactionInclude,
    })

    res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id
    const transaction = await Transaction.findByPk(transactionId)
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    if (!(await canAccessTransaction(transaction, req))) {
      return res.status(403).json({ message: "You do not have access to this transaction" })
    }

    const budgetId = transaction.budgetId
    await transaction.destroy()
    if (budgetId) {
      await syncBudgetAlerts(budgetId)
    }
    res.status(200).json({ message: "Transaction deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTransactionsByBudget = async (req, res) => {
  try {
    const budgetId = req.params.budgetId
    const budget = await canAccessBudget(budgetId, req)
    if (!budget) {
      return res.status(403).json({ message: "You do not have access to this budget" })
    }
    const transactions = await Transaction.findAll({
      where: { budgetId },
      include: transactionInclude,
    })
    res.status(200).json({ message: "Transactions retrieved successfully", transactions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTransactionsByUser = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      include: transactionInclude,
    })
    res.status(200).json({ message: "Transactions retrieved successfully", transactions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id
    const transaction = await Transaction.findByPk(transactionId, {
      include: transactionInclude,
    })
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    if (!(await canAccessTransaction(transaction, req))) {
      return res.status(403).json({ message: "You do not have access to this transaction" })
    }

    res.status(200).json({ message: "Transaction retrieved successfully", transaction })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionsByBudget,
  getTransactionsByUser,
  getTransactionById,
}
