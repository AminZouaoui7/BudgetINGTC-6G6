const Category = require("../entites/categoryentity")

const isAdmin = (req) => req.user?.role === "admin"

const isCategoryAccessible = (category, req) => {
  if (!category) return false
  if (isAdmin(req)) return true
  return category.userId === null || category.userId === req.user.id
}

const createCategory = async (req, res) => {
  try {
    const { name, description, isGlobal, userId, type, color, icon } = req.body

    if (!name) {
      return res.status(400).json({ message: "name is required" })
    }

    let categoryUserId = req.user.id
    if (isAdmin(req)) {
      if (isGlobal === true || userId === null) {
        categoryUserId = null
      } else if (userId !== undefined) {
        categoryUserId = userId
      }
    }

    const newCategory = await Category.create({
      name,
      description,
      userId: categoryUserId,
      type,
      color,
      icon,
    })

    res.status(201).json({ message: "category created successfully", category: newCategory })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getallcategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["name", "ASC"]] })
    const authorizedCategories = categories.filter((category) =>
      isAdmin(req) || category.userId === null || category.userId === req.user.id,
    )
    res.status(200).json({ message: "categories retrieved successfully", categories: authorizedCategories })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getcategorybyid = async (req, res) => {
  try {
    const categoryid = req.params.id
    const categoryById = await Category.findByPk(categoryid)
    if (!categoryById) {
      return res.status(404).json({ message: "category not found" })
    }

    if (!isCategoryAccessible(categoryById, req)) {
      return res.status(403).json({ message: "Access denied to this category" })
    }

    res.status(200).json({ message: "category retrieved successfully", category: categoryById })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updatecategory = async (req, res) => {
  try {
    const categoryid = req.params.id
    const { name, description, type, color, icon } = req.body
    const categoryToUpdate = await Category.findByPk(categoryid)
    if (!categoryToUpdate) {
      return res.status(404).json({ message: "category not found" })
    }

    if (!isCategoryAccessible(categoryToUpdate, req)) {
      return res.status(403).json({ message: "You are not allowed to update this category" })
    }

    await categoryToUpdate.update({ name, description, type, color, icon })
    res.status(200).json({ message: "category updated successfully", category: categoryToUpdate })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deletecategory = async (req, res) => {
  try {
    const categoryid = req.params.id
    const categoryToDelete = await Category.findByPk(categoryid)
    if (!categoryToDelete) {
      return res.status(404).json({ message: "category not found" })
    }

    if (!isCategoryAccessible(categoryToDelete, req)) {
      return res.status(403).json({ message: "You are not allowed to delete this category" })
    }

    await categoryToDelete.destroy()
    res.status(200).json({ message: "category deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createCategory, getallcategories, getcategorybyid, updatecategory, deletecategory }
