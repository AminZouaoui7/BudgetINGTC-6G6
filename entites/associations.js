const BudgetCategory = require("./budgetcategoryentity");
const Budget = require("./budgetentity");
const BudgetMember = require("./budgetMemberentity");
const Category = require("./categoryentity");
const Comment = require("./commententity");
const Transaction = require("./transactionentity");
const Alert = require("./alertentity");
const User = require("./userentity");

//use can have many categories
User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "userId" });
//user own many budgets
User.hasMany(Budget, { foreignKey: "ownerId", onDelete: "CASCADE" });
Budget.belongsTo(User, { foreignKey: "ownerId" });
// A user can create many transactions
User.hasMany(Transaction,   { foreignKey: "userId",        as: "transactions" })
Transaction.belongsTo(User, { foreignKey: "userId",        as: "author" })
// User <-> Budget (shared budgets) via BudgetMember
User.belongsToMany(Budget, { through: BudgetMember, foreignKey: "userId",   as: "sharedBudgets" })
Budget.belongsToMany(User, { through: BudgetMember, foreignKey: "budgetId", as: "participants" })

// A budget has many members (collaborative)
Budget.hasMany(BudgetMember,       { foreignKey: "budgetId",    as: "members" })
BudgetMember.belongsTo(Budget,     { foreignKey: "budgetId",    as: "budget" })

// A budget has per-category limits
Budget.hasMany(BudgetCategory,     { foreignKey: "budgetId",    as: "categoryLimits" })
BudgetCategory.belongsTo(Budget,   { foreignKey: "budgetId",    as: "budget" })


// Budget <-> Category via BudgetCategory
Budget.belongsToMany(Category, { through: BudgetCategory, foreignKey: "budgetId",   as: "categories" })
Category.belongsToMany(Budget, { through: BudgetCategory, foreignKey: "categoryId", as: "budgets" })

// A budget has many transactions
Budget.hasMany(Transaction,        { foreignKey: "budgetId",    as: "transactions" })
Transaction.belongsTo(Budget,      { foreignKey: "budgetId",    as: "budget" })

// A category has many transactions
Category.hasMany(Transaction,      { foreignKey: "categoryId",  as: "transactions" })
Transaction.belongsTo(Category,    { foreignKey: "categoryId",  as: "category" })

// A transaction can have many comments
Transaction.hasMany(Comment,       { foreignKey: "transactionId", as: "comments" })
Comment.belongsTo(Transaction,     { foreignKey: "transactionId", as: "transaction" })
// A budget can trigger many alerts
Budget.hasMany(Alert,              { foreignKey: "budgetId",    as: "alerts" })
Alert.belongsTo(Budget,        { foreignKey: "budgetId",    as: "budget" })


