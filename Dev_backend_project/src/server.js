const express=require("express")
const connectDB=require("./config/data_base")
const User=require("./models/user")

const app=express()

app.use(express.json())

app.post("/signup",async (req,res)=>{
    const user= new User(req.body)

    try {
        await user.save()
        res.send("user added successfully")
    }catch (err){
        res.status(400).send("error saved to user :"+err.message)
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

