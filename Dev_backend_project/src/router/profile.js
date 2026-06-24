const express=require("express")
const profileRouter=express.Router()
const{userAuth}=require("../middlerware/auth")
const {validatorEditProfileData}=require("../util/validation")
const bcrypt = require("bcryptjs");


//profile
profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
        const user=req.user
        res.send(user)
    }
    catch (err){
        res.status(404).send("ERROR"+err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth,async (req,res)=>{
try{
    if(!validatorEditProfileData(req)){
        throw new Error("Invalid Edit request")
    }

    const loggedInUser=req.user
    Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
    await loggedInUser.save()

    res.json({message:`${loggedInUser.firstName} your profile update successfully`,data:loggedInUser})
}
catch (err){
    res.status(400).json({
        message: err.message
    });
}
})

profileRouter.patch("/profile/change-password",userAuth,async (req,res)=>{
  try{
      const {oldPassword,newPassword}=req.body
      const loggedInPassword=req.user
      const isPasswordValid=await loggedInPassword.comparePassword(oldPassword)

      if(!isPasswordValid){
          throw new Error("Old password is incorrect")
      }
      loggedInPassword.password=await loggedInPassword.getPasswordHash(newPassword)
      res.send("password changed successfully")
      loggedInPassword.save()

  }
  catch (err){
      res.status(404).send("ERROR :"+err.message)
  }


})

module.exports=profileRouter