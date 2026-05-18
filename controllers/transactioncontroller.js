//DELETE/transactions/:id-delete a transaction (only if user is owner or member of the budget)
//GET/transactions/budget/:budgetId-get all transactions for a specific budget (only if user is owner or member of the budget)
const Transaction = require("../entites/transactionentity")
const Budget = require("../entites/budgetentity")
const Category = require("../entites/categoryentity")
const { Op } = require("sequelize")
const BudgetMember = require("../entites/budgetMemberentity")
//verify if user has access to the budget (owner or member)
const canAccessBudget = async (budgetId, userId) => {
  const budget = await Budget.findByPk(budgetId)
  if (!budget) return null
  const isMember = await BudgetMember.findOne({ where: { budgetId, userId } })
  if (budget.ownerId !== userId && !isMember) return null
  return budget
}

//POST/transactions-create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { amount, type, date, description, categoryId, budgetId } = req.body
        if (!amount || !type || !date) {
            return res.status(400).json({ message: "amount, type and date are required" })
        }
        // If budgetId is provided, check if user has access to the budget
        if (budgetId) {
            const budget = await canAccessBudget(budgetId, req.user.id)
            if (!budget) {
                return res.status(403).json({ message: "You do not have access to this budget" })
            }
        }
        // If categoryId is provided, check if category exists and belongs to the user
        if (categoryId) {
            const category = await Category.findByPk(categoryId)
            if (!category || category.userId !== req.user.id) {
                return res.status(403).json({ message: "You do not have access to this category" })
            }
        }
        const newTransaction = await Transaction.create({
            amount,
            type,
            date,
            description,
            categoryId,
            budgetId,
            userId: req.user.id
        })
        res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
//GET/transactions-current user's transactions ,with optional filters (type, date range, category)
const getTransactions = async (req, res) => {
    try {
        const { type, startDate, endDate, categoryId } = req.query
        const filters = { userId: req.user.id }
        if (type) filters.type = type
        if (startDate && endDate) {
            filters.date = { [Op.between]: [startDate, endDate] }
        }
        if (categoryId) filters.categoryId = categoryId
        const transactions = await Transaction.findAll({ where: filters })
        res.status(200).json({ message: "Transactions retrieved successfully", transactions })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
//PUT/transactions/:id-update a transaction (only if user is owner or member of the budget)
const updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findByPk(transactionId)
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" })
        }
        // If transaction is linked to a budget, check if user has access to the budget
        if (transaction.budgetId) {
            const budget = await canAccessBudget(transaction.budgetId, req.user.id)
            if (!budget) {
                return res.status(403).json({ message: "You do not have access to this budget" })
            }
        }
        // If transaction is linked to a category, check if user has access to the category
        if (transaction.categoryId) {
            const category = await Category.findByPk(transaction.categoryId)
            if (!category || category.userId !== req.user.id) {
                return res.status(403).json({ message: "You do not have access to this category" })
            }
        }
        const { amount, type, date, description, categoryId, budgetId } = req.body
        await transaction.update({ amount, type, date, description, categoryId, budgetId })
        res.status(200).json({ message: "Transaction updated successfully", transaction })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
//DELETE/transactions/:id-delete a transaction (only if user is owner or member of the budget)
const deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findByPk(transactionId)
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" })
        }
        // If transaction is linked to a budget, check if user has access to the budget
        if (transaction.budgetId) {
            const budget = await canAccessBudget(transaction.budgetId, req.user.id)
            if (!budget) {
                return res.status(403).json({ message: "You do not have access to this budget" })
            }
        }
        // If transaction is linked to a category, check if user has access to the category
        if (transaction.categoryId) {
            const category = await Category.findByPk(transaction.categoryId)
            if (!category || category.userId !== req.user.id) {
                return res.status(403).json({ message: "You do not have access to this category" })
            }
        }
        await transaction.destroy()
        res.status(200).json({ message: "Transaction deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
//GET/transactions/budget/:budgetId-get all transactions for a specific budget (only if user is owner or member of the budget)
const getTransactionsByBudget = async (req, res) => {
    try {
        const budgetId = req.params.budgetId
        const budget = await canAccessBudget(budgetId, req.user.id)
        if (!budget) {
            return res.status(403).json({ message: "You do not have access to this budget" })
        }
        const transactions = await Transaction.findAll({ where: { budgetId } })
        res.status(200).json({ message: "Transactions retrieved successfully", transactions })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
//get transations :current user's transactions
const getTransactionsByUser = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ where: { userId: req.user.id } })
        res.status(200).json({ message: "Transactions retrieved successfully", transactions })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 const getTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findByPk(transactionId)
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" })
        }
        // If transaction is linked to a budget, check if user has access to the budget
        if (transaction.budgetId) {
            const budget = await canAccessBudget(transaction.budgetId, req.user.id)
            if (!budget) {
                return res.status(403).json({ message: "You do not have access to this budget" })
            }
        }
        // If transaction is linked to a category, check if user has access to the category
        if (transaction.categoryId) {
            const category = await Category.findByPk(transaction.categoryId)
            if (!category || category.userId !== req.user.id) {
                return res.status(403).json({ message: "You do not have access to this category" })
            }
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
    getTransactionById
}