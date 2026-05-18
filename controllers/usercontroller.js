const user = require("../entites/userentity")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")   
const register = async (req, res) => {
try {
    const { fullName, email, password, phoneNumber, address , role, isActive} = req.body
    if (!fullName || !email || !password || !phoneNumber || !address) {
        return res.status(400).json({ message: "all fields are required" })
    }
    const userexist=await user.findOne({where:{email}})
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
        role,
        isActive
    })
    res.status(201).json({message:"user created successfully",user:newuser})
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
        const ismatch=await bcrypt.compare(password,userexist.password)
        if(!ismatch){
            return res.status(400).json({message:"invalid credentials"})
        }
        const token=generateToken(userexist)
        res.status(200).json({message:"login successful",user:userexist,token})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getallusers=async(req,res)=>{
    try {
        const users=await user.findAll()
        res.status(200).json({message:"users retrieved successfully",users})
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
        const { fullName, email, password, phoneNumber, address , role, isActive} = req.body
        const userToUpdate=await user.findByPk(id)
        if(!userToUpdate){
            return res.status(404).json({message:"user not found"})
        }
        const hashpassword=await bcrypt.hash(password,10)
        await userToUpdate.update({
            fullName,
            email,
            password:hashpassword,
            phoneNumber,
            address,
            role,
            isActive
        })
        res.status(200).json({message:"user updated successfully", user: userToUpdate})
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
      user: existing,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports={register, login, getallusers, deleteuser, updateuser, activateUser}
   