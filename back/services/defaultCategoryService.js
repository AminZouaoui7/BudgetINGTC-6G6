const Category = require("../entites/categoryentity")

const CATEGORY_META_PREFIX = "__budget_meta__:"

const buildCategoryDescription = (payload) => {
  return `${CATEGORY_META_PREFIX}${JSON.stringify(payload)}`
}

const DEFAULT_CATEGORIES = [
  {
    name: "Salaire",
    description: buildCategoryDescription({
      note: "Revenus salariaux",
      type: "income",
      color: "#10b981",
      icon: "Briefcase",
    }),
  },
  {
    name: "Freelance",
    description: buildCategoryDescription({
      note: "Prestations et missions",
      type: "income",
      color: "#3b82f6",
      icon: "TrendingUp",
    }),
  },
  {
    name: "Courses",
    description: buildCategoryDescription({
      note: "Achats du quotidien",
      type: "expense",
      color: "#f59e0b",
      icon: "ShoppingCart",
    }),
  },
  {
    name: "Transport",
    description: buildCategoryDescription({
      note: "Carburant, taxi et transports publics",
      type: "expense",
      color: "#6366f1",
      icon: "Car",
    }),
  },
  {
    name: "Logement",
    description: buildCategoryDescription({
      note: "Loyer, charges et entretien",
      type: "expense",
      color: "#8b5cf6",
      icon: "Home",
    }),
  },
  {
    name: "Sante",
    description: buildCategoryDescription({
      note: "Depenses medicales et assurance",
      type: "expense",
      color: "#ef4444",
      icon: "Heart",
    }),
  },
]

const ensureDefaultCategories = async () => {
  for (const defaultCategory of DEFAULT_CATEGORIES) {
    const existingCategory = await Category.findOne({
      where: { name: defaultCategory.name, userId: null },
    })

    if (!existingCategory) {
      await Category.create({
        ...defaultCategory,
        userId: null,
      })
      continue
    }

    await existingCategory.update({
      description: defaultCategory.description,
    })
  }
}

module.exports = {
  ensureDefaultCategories,
}
