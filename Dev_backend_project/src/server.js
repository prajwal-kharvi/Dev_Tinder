const express=require("express")
require("dotenv").config()
const connectDB=require("./config/data_base")
const cookieParser=require("cookie-parser")
const cors=require("cors")


const app=express()

app.use(cors({
    origin:"http://localhost:5174",
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())

const authRouter=require("./router/auth")
const profileRouter=require("./router/profile")
const requestRouter=require("./router/request")
const userRouter=require("./router/user")


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)



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

