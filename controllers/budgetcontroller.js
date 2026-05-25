const budget=require('../entites/budgetentity')
const createBudget=async(req,res)=>{
    try {
        const {name,amount,description,periodType,endDate,startDate,isshared,ownerId}=req.body
        if(!name || !amount){
            return res.status(400).json({message:"name and amount are required"})
        }
        const newbudget=await budget.create({
            name,
            amount,
            description,
            periodType,
            endDate,
            startDate,
            isshared,
            ownerId
        })
        res.status(201).json({message:"Budget created successfully", budget: newbudget})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getallbudgets=async(req,res)=>{
    try {
        const budgets=await budget.findAll()
        res.status(200).json({message:"budgets retrieved successfully",budgets})
    } catch (error) {
        res.status(500).json({message:error.message})
    } 
}
const getbudgetbyid=async(req,res)=>{
    try {
        const budgetid=req.params.id
        const budgetbyid=await budget.findByPk(budgetid)
        if(!budgetbyid){
            return res.status(404).json({message:"Budget not found"})
        }
        res.status(200).json({message:"Budget retrieved successfully", budget: budgetbyid})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const updatebudget=async(req,res)=>{
    try {
        const budgetid=req.params.id
        const {name,amount,description,periodType,endDate,startDate,isshared,ownerId}=req.body
        const budgetToUpdate=await budget.findByPk(budgetid)
        if(!budgetToUpdate){
            return res.status(404).json({message:"Budget not found"})
        }
        await budgetToUpdate.update({name,amount,description,periodType,endDate,startDate,isshared,ownerId})
        res.status(200).json({message:"Budget updated successfully", budget: budgetToUpdate})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deletebudget=async(req,res)=>{
    try {
        const budgetid=req.params.id
        const budgetToDelete=await budget.findByPk(budgetid)
        if(!budgetToDelete){
            return res.status(404).json({message:"Budget not found"})
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
    const { id } = req.params; // budget ID
    const { userId, role } = req.body; // user to add and their role in the budget
    // Validate input
    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required." });
    }
    // Check if budget exists
    const budgetmember = await Budget.findByPk(id);
    if (!budgetmember) {
      return res.status(404).json({ message: "Budget not found." });
    }
    // Check if user exists    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Add member to budget    
    const newMember = await BudgetMember.create({
      budgetId: id,
      userId,
      role
    });
    res.status(201).json({ message: "Member added to budget successfully.", member: newMember });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /budgets/:id/members/:userId — remove a member
const removeMemberFromBudget = async (req, res) => {
  try {
    const { id, userId } = req.params; // budget ID and user ID to remove
    // Check if budget exists
    const budgetmember = await Budget.findByPk(id);
    if (!budgetmember) {
      return res.status(404).json({ message: "Budget not found." });
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
    const budget = await Budget.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found." });
    }

    // Create category limit
    const categoryLimit = await CategoryLimit.create({
      budgetId: id,
      categoryId,
      limit
    });

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
