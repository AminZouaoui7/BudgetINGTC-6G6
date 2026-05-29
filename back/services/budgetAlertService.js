const { Op } = require("sequelize")
const Alert = require("../entites/alertentity")
const Budget = require("../entites/budgetentity")
const BudgetMember = require("../entites/budgetMemberentity")
const Transaction = require("../entites/transactionentity")

const ALERT_THRESHOLD_RATIO = 0.8

const formatAmount = (value) => Number(value || 0).toFixed(2)

const getRecipientIds = async (budget) => {
  const members = await BudgetMember.findAll({
    where: { budgetId: budget.id },
    attributes: ["userId"],
  })

  return [...new Set([budget.ownerId, ...members.map((member) => member.userId)])]
}

const buildAlertPayload = (budget, spent) => {
  const budgetLimit = Number(budget.amount || 0)

  if (budgetLimit <= 0) {
    return null
  }

  if (spent > budgetLimit) {
    return {
      type: "exceeded",
      message: `Le budget "${budget.name}" a depasse le plafond (${formatAmount(spent)} / ${formatAmount(budgetLimit)}).`,
    }
  }

  if (spent >= budgetLimit * ALERT_THRESHOLD_RATIO) {
    return {
      type: "threshold",
      message: `Le budget "${budget.name}" approche du plafond (${formatAmount(spent)} / ${formatAmount(budgetLimit)}).`,
    }
  }

  return null
}

const syncBudgetAlerts = async (budgetId) => {
  if (!budgetId) {
    return
  }

  const budget = await Budget.findByPk(budgetId)
  if (!budget) {
    return
  }

  const transactions = await Transaction.findAll({
    where: {
      budgetId,
      type: "expense",
    },
    attributes: ["amount"],
  })

  const spent = transactions.reduce((total, transaction) => {
    return total + Math.abs(Number(transaction.amount || 0))
  }, 0)

  const recipientIds = await getRecipientIds(budget)
  if (!recipientIds.length) {
    return
  }

  await Alert.destroy({
    where: {
      budgetId,
      type: { [Op.in]: ["threshold", "exceeded"] },
      userId: { [Op.notIn]: recipientIds },
    },
  })

  const activeAlert = buildAlertPayload(budget, spent)
  const activeType = activeAlert?.type || null
  const obsoleteTypes = ["threshold", "exceeded"].filter((type) => type !== activeType)

  if (obsoleteTypes.length) {
    await Alert.destroy({
      where: {
        budgetId,
        userId: { [Op.in]: recipientIds },
        type: { [Op.in]: obsoleteTypes },
      },
    })
  }

  if (!activeAlert) {
    return
  }

  await Promise.all(
    recipientIds.map(async (userId) => {
      const existingAlert = await Alert.findOne({
        where: {
          budgetId,
          userId,
          type: activeAlert.type,
        },
      })

      if (existingAlert) {
        await existingAlert.update({
          message: activeAlert.message,
          isRead: false,
        })
        return
      }

      await Alert.create({
        budgetId,
        userId,
        type: activeAlert.type,
        message: activeAlert.message,
        isRead: false,
      })
    }),
  )
}

const syncAllBudgets = async () => {
  const budgets = await Budget.findAll({ attributes: ["id"] })
  for (const budget of budgets) {
    await syncBudgetAlerts(budget.id)
  }
}

module.exports = {
  syncBudgetAlerts,
  syncAllBudgets,
}
