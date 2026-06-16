const express=require("express")
require("dotenv").config()
const connectDB=require("./config/data_base")
const User=require("./models/user")
const {validatorSingUpData}=require("./util/validation")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")

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

    const isPasswordValid= await  bcrypt.compare(password,user.password)
    if(isPasswordValid){

        //create jwt token
        const token=await jwt.sign({_id:user._id},"DevTinder@2003")

        //add the token to cookie and send response to user
        res.cookie("token",token)

        res.send("Login successful!!!")
    }else{
        throw new Error("Invalid credentials")
    }

}catch (err){
    res.status(404).send("ERROR :"+err.message)
}

})

//profile
app.get("/profile",async (req,res)=>{
    try{
        const cookies=req.cookies
        const{token}=cookies
        if(!token){
            throw new Error("Invalid Token")
        }

        const decodedMessage=await jwt.verify(token,"DevTinder@2003")
        const {_id}=decodedMessage
        console.log("Logged In user:"+_id)

        const user=await User.findById(_id)
        if(!user){
            throw new Error("User does not exits")
        }

        res.send(user)
    }
    catch (err){
        res.status(404).send("ERROR"+err.message)
    }
})

//Get user emailID
app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId

    try{
        const user=await User.find({emailId: userEmail})
        if (user.length===0){
            res.status(404).send("user not found")
        }else {
            res.send(user)
        }

    }catch (err){
        res.status(404).send("user not found"+err.message)
    }
})

//get /feed all the user from the database
app.get("/feed",async (req,res)=>{

    try{
        const users=await User.find({})
        res.send(users)

    }catch (err){
        res.status(404).send("user not found"+err.message)
    }

})

//delete the data from database
app.delete("/user",async (req,res)=>{
    const userId=req.body.userId
    try{
        const user=await User.findByIdAndDelete(userId)
        res.send("sucessfuly delete data")

    }catch (err){
        res.status(404).send("user not found")
    }
})

app.patch("/user/:userId",async (req,res)=>{
    const userId=req.params?.userId
    const data=req.body

    try{
        const  Allowed_Update=["photoUrl","about","skills","gender","age"]

        const isUpdateAllowed =Object.keys(data).every((k)=>Allowed_Update.includes(k))
        if(!isUpdateAllowed){
            throw new Error("update not allowed")
        }
        if(data.skills.length>10){
            throw new  Error("allowed only 10 skills")
        }

        const users=await User.findByIdAndUpdate(userId,data,{returnDocument:"after",runValidators:true})
        res.send("succecfull update")

    }catch (err){
        res.status(404).send("user not found :"+err.message)
    }
})

app.patch("/user1",async (req,res)=>{
    const userEmailId=req.body.emailId
    const data=req.body
    console.log(data)

    try{


        const users=await User.findOneAndUpdate({emailId:userEmailId},data)
        console.log(users)
        res.send("succesfull updated ")

    }catch (err){
        res.status(404).send("user not found")
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

