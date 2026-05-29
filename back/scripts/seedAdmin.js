const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const User = require("../entites/userentity");
require("../entites/associations");

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = "admin@budget.com";
    const password = "123456";
    const passwordHash = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      await existingUser.update({
        fullName: "Budget Admin",
        password: passwordHash,
        phoneNumber: "0600000000",
        address: "Budget HQ",
        role: "admin",
        isActive: true,
      });

      console.log("Admin user updated successfully.");
    } else {
      await User.create({
        fullName: "Budget Admin",
        email,
        password: passwordHash,
        phoneNumber: "0600000000",
        address: "Budget HQ",
        role: "admin",
        isActive: true,
      });

      console.log("Admin user created successfully.");
    }
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
