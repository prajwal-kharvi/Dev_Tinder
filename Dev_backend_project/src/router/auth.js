const express=require("express")
const authRouter=express.Router()
const {validatorSingUpData}=require("../util/validation")
const bcrypt=require("bcryptjs")
const User=require("../models/user")
const validator = require("validator");


//sigup
authRouter.post("/signup",async (req,res)=>{
    try {
        //validation of data
        validatorSingUpData(req)
        const {firstName,lastName,emailId,password}=req.body

        //encrypt the password
        const passwordHash= await bcrypt.hash(password,10)

//creating a new instance od the user model
        const user= new User({firstName,lastName,emailId,password:passwordHash })
        const savedUser=await user.save()

        //create jwt token
        const token=await savedUser.getJWT()

        //add the token to cookie and send response to user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 3600000),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        res.json({message:"user added successfully",data:savedUser})
    }catch (err){
        res.status(400).send("ERROR :"+err.message)
    }

})

//login
authRouter.post("/login",async (req,res)=>{
    try{
        const {emailId,password}=req.body
        if (!validator.isEmail(emailId)){
            throw new Error("Invalid email address")
        }
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw  new Error("Invalid credentials")
        }

        const isPasswordValid=await user.validatepassword(password)
        if(isPasswordValid){

            //create jwt token
            const token=await user.getJWT()
            console.log(token)


            //add the token to cookie and send response to user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 7 * 3600000),
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })

            res.send(user)
        }else{
            throw new Error("Invalid credentials")
        }

    }catch (err){
        res.status(404).send("ERROR :"+err.message)
    }

})

//logout
authRouter.post("/logout",async (req,res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.send("logout successfully")
})

module.exports=authRouter