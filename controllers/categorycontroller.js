const category=require("../entites/categoryentity")
const createCategory=async(req,res)=>{
    try {const {name,description}=req.body
    if(!name){
        return res.status(400).json({message:"name is required"})
    }
    const newcategory=await category.create({
        name,
        description,
        userId:req.user.id
    })
    res.status(201).json({message:"category created successfully",category:newcategory})       
        
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }   
}
const getallcategories=async(req,res)=>{
    try {
        const categories=await category.findAll()
        res.status(200).json({message:"categories retrieved successfully",categories})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getcategorybyid=async(req,res)=>{
    try {
        const categoryid=req.params.id
        const categorybyid=await category.findByPk(categoryid)
        if(!categorybyid){
            return res.status(404).json({message:"category not found"})
        }
        res.status(200).json({message:"category retrieved successfully",category:categorybyid})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const updatecategory=async(req,res)=>{
    try {
        const categoryid=req.params.id
        const {name,description}=req.body
        const categoryToUpdate=await category.findByPk(categoryid)
        if(!categoryToUpdate){
            return res.status(404).json({message:"category not found"})
        }
        await categoryToUpdate.update({name,description})
        res.status(200).json({message:"category updated successfully",category:categoryToUpdate})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deletecategory=async(req,res)=>{
    try {
        const categoryid=req.params.id
        const categoryToDelete=await category.findByPk(categoryid)
        if(!categoryToDelete){
            return res.status(404).json({message:"category not found"})
        }
        await categoryToDelete.destroy()
        res.status(200).json({message:"category deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
module.exports={createCategory, getallcategories, getcategorybyid, updatecategory, deletecategory}