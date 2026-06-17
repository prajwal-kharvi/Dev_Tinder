const express=require("express")
require("dotenv").config()
const connectDB=require("./config/data_base")
const User=require("./models/user")
const {validatorSingUpData}=require("./util/validation")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")
const{userAuth}=require("./middlerware/auth")

const app=express()

app.use(express.json())
app.use(cookieParser())

//sigup
app.post("/signup",async (req,res)=>{
    try {
        //validation of data
        validatorSingUpData(req)
        const {firstName,lastName,emailId,password}=req.body

        //encrypt the password
        const passwordHash= await bcrypt.hash(password,10)

//creating a new instance od the user model
        const user= new User({firstName,lastName,emailId,password:passwordHash })
        await user.save()
        res.send("user added successfully")
    }catch (err){
        res.status(400).send("ERROR :"+err.message)
    }

})

//login
app.post("/login",async (req,res)=>{
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

        //add the token to cookie and send response to user
        res.cookie("token",token,{expires:new Date(Date.now()+7*3600000)})

        res.send("Login successful!!!")
    }else{
        throw new Error("Invalid credentials")
    }

}catch (err){
    res.status(404).send("ERROR :"+err.message)
}

})

//profile
app.get("/profile",userAuth,async (req,res)=>{
    try{
        const user=req.user
        res.send(user)
    }
    catch (err){
        res.status(404).send("ERROR"+err.message)
    }
})

app.post("/sendConnectionRequest",userAuth ,async (req,res)=>{
    try {
        const user=req.user
        res.send(user.firstName+": send the connect request")
    }
    catch (err){
        res.status(404).send("connection failed")
    }

})

connectDB().then(()=>{
    console.log("Database connection established")
    app.listen(7777,()=>{
        console.log("Server is running on port 7777")
    })
})
    .catch((err) => {
        console.error("Database cannot be connected!!");
        console.error(err);
    });

