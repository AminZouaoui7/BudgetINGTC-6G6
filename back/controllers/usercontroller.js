const user = require("../entites/userentity")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")   

const toSafeUser = (userRecord) => {
    if (!userRecord) {
        return null
    }

    const plainUser = typeof userRecord.toJSON === "function" ? userRecord.toJSON() : userRecord
    const { password, ...safeUser } = plainUser
    return safeUser
}

const assignIfDefined = (target, key, value) => {
    if (value !== undefined) {
        target[key] = value
    }
}

const ensureUniqueEmail = async (email, excludedUserId = null) => {
    if (!email) {
        return null
    }

    const existingUser = await user.findOne({ where: { email } })
    if (existingUser && existingUser.id !== excludedUserId) {
        return existingUser
    }

    return null
}

const buildUserUpdateValues = async (payload, options = {}) => {
    const { allowRole = false, allowActive = false, allowPassword = false } = options
    const nextValues = {}

    assignIfDefined(nextValues, "fullName", payload.fullName)
    assignIfDefined(nextValues, "email", payload.email)
    assignIfDefined(nextValues, "phoneNumber", payload.phoneNumber)
    assignIfDefined(nextValues, "address", payload.address)

    if (allowRole) {
        assignIfDefined(nextValues, "role", payload.role)
    }

    if (allowActive) {
        assignIfDefined(nextValues, "isActive", payload.isActive)
    }

    if (allowPassword && payload.password) {
        nextValues.password = await bcrypt.hash(payload.password,10)
    }

    return nextValues
}

const register = async (req, res) => {
try {
    const { fullName, email, password, phoneNumber, address } = req.body
    if (!fullName || !email || !password || !phoneNumber || !address) {
        return res.status(400).json({ message: "all fields are required" })
    }
    const userexist=await ensureUniqueEmail(email)
    if(userexist){
        return res.status(400).json({message:"user already exist"})
    }
    const hashpassword=await bcrypt.hash(password,10)
    const newuser=await user.create({
        fullName,
        email,
        password:hashpassword,
        phoneNumber,
        address,
        role:"user",
        isActive:false
    })
    res.status(201).json({message:"user created successfully",user:toSafeUser(newuser)})
} catch (error) {
    res.status(500).json({message:error.message})
}
}
const generateToken=(user)=>{
    // generate token logic here
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3w' });
}
const login = async (req, res) => {
    // login logic here
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" })
        }
        const userexist=await user.findOne({where:{email}})
        if(!userexist){
            return res.status(400).json({message:"invalid credentials"})
        }
        if(!userexist.isActive){
            return res.status(403).json({message:"Compte non activé. Contactez l'administrateur."})
        }
        const ismatch=await bcrypt.compare(password,userexist.password)
        if(!ismatch){
            return res.status(400).json({message:"invalid credentials"})
        }
        const token=generateToken(userexist)
        res.status(200).json({message:"login successful",user:toSafeUser(userexist),token})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getallusers=async(req,res)=>{
    try {
        const users=await user.findAll({
            order: [["createdAt", "DESC"]]
        })
        res.status(200).json({message:"users retrieved successfully",users:users.map(toSafeUser)})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deleteuser=async(req,res)=>{
    try {
        const {id}=req.params
        const userToDelete=await user.findByPk(id)
        if(!userToDelete){
            return res.status(404).json({message:"user not found"})
        }
        await userToDelete.destroy()
        res.status(200).json({message:"user deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const updateuser=async(req,res)=>{
    try {
        const {id}=req.params
        const userToUpdate=await user.findByPk(id)
        if(!userToUpdate){
            return res.status(404).json({message:"user not found"})
        }

        if (req.body.email) {
            const existingUser = await ensureUniqueEmail(req.body.email, userToUpdate.id)
            if (existingUser) {
                return res.status(400).json({ message: "email already in use" })
            }
        }

        const nextValues = await buildUserUpdateValues(req.body, {
            allowRole: true,
            allowActive: true,
            allowPassword: true,
        })

        await userToUpdate.update(nextValues)
        res.status(200).json({message:"user updated successfully", user: toSafeUser(userToUpdate)})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const activateUser = async (req, res) => {
  try {
   /*  if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit." });
    }
  */
    const { id } = req.params;
    const existing = await user.findByPk(id);
 
    if (!existing) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
 
    await existing.update({ isActive: true });
 
    return res.status(200).json({
      message: "Compte activé avec succès.",
      user: toSafeUser(existing),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
    try {
        const currentUser = await user.findByPk(req.user.id)
        if (!currentUser) {
            return res.status(404).json({ message: "user not found" })
        }

        return res.status(200).json({
            message: "user retrieved successfully",
            user: toSafeUser(currentUser),
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateCurrentUser = async (req, res) => {
    try {
        const currentUser = await user.findByPk(req.user.id)
        if (!currentUser) {
            return res.status(404).json({ message: "user not found" })
        }

        if (req.body.email) {
            const existingUser = await ensureUniqueEmail(req.body.email, currentUser.id)
            if (existingUser) {
                return res.status(400).json({ message: "email already in use" })
            }
        }

        const nextValues = await buildUserUpdateValues(req.body)
        await currentUser.update(nextValues)

        return res.status(200).json({
            message: "profile updated successfully",
            user: toSafeUser(currentUser),
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "all password fields are required" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "new password must contain at least 6 characters" })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "password confirmation does not match" })
        }

        const currentUser = await user.findByPk(req.user.id)
        if (!currentUser) {
            return res.status(404).json({ message: "user not found" })
        }

        const isMatch = await bcrypt.compare(currentPassword, currentUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: "current password is invalid" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await currentUser.update({ password: hashedPassword })

        return res.status(200).json({ message: "password updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports={
    register,
    login,
    getallusers,
    deleteuser,
    updateuser,
    activateUser,
    getCurrentUser,
    updateCurrentUser,
    changePassword
}
   
