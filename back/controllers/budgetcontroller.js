const Budget = require('../entites/budgetentity')
const User = require('../entites/userentity')
const BudgetMember = require('../entites/budgetMemberentity')
const CategoryLimit = require('../entites/budgetcategoryentity')
const { Op } = require("sequelize")
const { syncBudgetAlerts } = require("../services/budgetAlertService")

const isAdmin = (req) => req.user?.role === "admin"

const getMemberBudgetIds = async (userId) => {
  const memberships = await BudgetMember.findAll({ where: { userId } })
  return memberships.map((membership) => membership.budgetId)
}

const canAccessBudget = async (budgetId, req) => {
  const budget = await Budget.findByPk(budgetId)
  if (!budget) {
    return null
  }

  if (isAdmin(req) || budget.ownerId === req.user.id) {
    return budget
  }

  const membership = await BudgetMember.findOne({
    where: { budgetId, userId: req.user.id },
  })

  return membership ? budget : null
}

const canManageBudget = async (budgetId, req) => {
  const budget = await Budget.findByPk(budgetId)
  if (!budget) {
    return null
  }

  if (isAdmin(req) || budget.ownerId === req.user.id) {
    return budget
  }

  return null
}

const createBudget=async(req,res)=>{
    try {
        const {name,amount,description,periodType,endDate,startDate,isshared,ownerId}=req.body
        if(!name || !amount){
            return res.status(400).json({message:"name and amount are required"})
        }
        const resolvedOwnerId = isAdmin(req) && ownerId ? ownerId : req.user.id
        const newbudget=await Budget.create({
            name,
            amount,
            description,
            periodType,
            endDate,
            startDate,
            isshared,
            ownerId: resolvedOwnerId
        })
        res.status(201).json({message:"Budget created successfully", budget: newbudget})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getallbudgets = async (req, res) => {
  try {
    const memberBudgetIds = await getMemberBudgetIds(req.user.id)
    const budgets = await Budget.findAll({
      where: {
        [Op.or]: [
          { ownerId: req.user.id },
          { id: { [Op.in]: memberBudgetIds.length ? memberBudgetIds : [-1] } },
        ],
      },
      include: [
        { model: User, as: "owner", attributes: ["id", "fullName", "email", "role"] },
        { model: User, as: "participants", attributes: ["id", "fullName", "email", "role"] },
      ],
    })
    res.status(200).json({ message: "budgets retrieved successfully", budgets })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const getbudgetbyid = async (req, res) => {
  try {
    const budgetid = req.params.id
    const budgetbyid = await canAccessBudget(budgetid, req)
    if (!budgetbyid) {
      return res.status(404).json({ message: "Budget not found or access denied" })
    }
    const budgetWithDetails = await Budget.findByPk(budgetid, {
      include: [
        { model: User, as: "owner", attributes: ["id", "fullName", "email", "role"] },
        { model: User, as: "participants", attributes: ["id", "fullName", "email", "role"] },
      ],
    })
    res.status(200).json({ message: "Budget retrieved successfully", budget: budgetWithDetails })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const updatebudget=async(req,res)=>{
    try {
        const budgetid=req.params.id
        const {name,amount,description,periodType,endDate,startDate,isshared,ownerId}=req.body
        const budgetToUpdate=await canManageBudget(budgetid, req)
        if(!budgetToUpdate){
            return res.status(403).json({message:"You are not allowed to update this budget"})
        }
        const resolvedOwnerId = isAdmin(req) && ownerId ? ownerId : budgetToUpdate.ownerId
        await budgetToUpdate.update({name,amount,description,periodType,endDate,startDate,isshared,ownerId: resolvedOwnerId})
        await syncBudgetAlerts(budgetToUpdate.id)
        res.status(200).json({message:"Budget updated successfully", budget: budgetToUpdate})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deletebudget=async(req,res)=>{
    try {
        const budgetid=req.params.id
        const budgetToDelete=await canManageBudget(budgetid, req)
        if(!budgetToDelete){
            return res.status(403).json({message:"You are not allowed to delete this budget"})
        }
        await budgetToDelete.destroy()
        res.status(200).json({message:"Budget deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
} 


// ── COLLABORATIVE
// POST /budgets/:id/members — add a member to a shared budget
const addMemberToBudget = async (req, res) => {
  try {
    const { id } = req.params // budget ID
    const { userId, role, email } = req.body // user to add and their role in the budget
    if (!role) {
      return res.status(400).json({ message: "role is required." })
    }
    if (!userId && !email) {
      return res.status(400).json({ message: "userId or email is required." })
    }

    const budgetMember = await canManageBudget(id, req)
    if (!budgetMember) {
      return res.status(403).json({ message: "You are not allowed to manage this budget." })
    }

    let user
    if (userId) {
      user = await User.findByPk(userId)
    } else {
      user = await User.findOne({ where: { email } })
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    const existingMember = await BudgetMember.findOne({
      where: {
        budgetId: id,
        userId: user.id,
      },
    })
    if (existingMember) {
      return res.status(400).json({ message: "User is already a member of this budget." })
    }

    const newMember = await BudgetMember.create({
      budgetId: id,
      userId: user.id,
      role,
    })
    await syncBudgetAlerts(id)
    res.status(201).json({ message: "Member added to budget successfully.", member: newMember })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

// DELETE /budgets/:id/members/:userId — remove a member
const removeMemberFromBudget = async (req, res) => {
  try {
    const { id, userId } = req.params; // budget ID and user ID to remove
    // Check if budget exists
    const budgetMember = await canManageBudget(id, req);
    if (!budgetMember) {
      return res.status(403).json({ message: "You are not allowed to manage this budget." });
    }
    // Check if member exists in the budget
    const member = await BudgetMember.findOne({
      where: {
        budgetId: id,
        userId
      }
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found in the budget." });
    }
    // Remove member from budget
    await member.destroy();
    await syncBudgetAlerts(id)
    res.status(200).json({ message: "Member removed from budget successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── CATEGORY LIMITS
// POST /budgets/:id/category-limits — set a spending limit for a category within a budget
const setCategoryLimit = async (req, res) => {
  try {
    const { id } = req.params; // budget ID
    const { categoryId, limit } = req.body; // category ID and spending limit

    // Validate input
    if (!categoryId || limit === undefined) {
      return res.status(400).json({ message: "categoryId and limit are required." });
    }

    // Check if budget exists
    const existingBudget = await canManageBudget(id, req);
    if (!existingBudget) {
      return res.status(403).json({ message: "You are not allowed to manage this budget." });
    }

    const existingLimit = await CategoryLimit.findOne({
      where: {
        budgetId: id,
        categoryId,
      }
    })

    let categoryLimit
    if (existingLimit) {
      await existingLimit.update({ limit })
      categoryLimit = existingLimit
    } else {
      categoryLimit = await CategoryLimit.create({
        budgetId: id,
        categoryId,
        limit
      });
    }

    res.status(201).json({ message: "Category limit set successfully.", categoryLimit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={
    createBudget,
    getallbudgets,
    getbudgetbyid,
    updatebudget,
    deletebudget,
    addMemberToBudget,
    removeMemberFromBudget,
    setCategoryLimit
}
