const express=require("express")
require("dotenv").config()
const connectDB=require("./config/data_base")
const cookieParser=require("cookie-parser")
const cors=require("cors")
const http=require("http")

const app=express()

app.use(cors({
    origin: [
        "http://localhost:5174",
        "http://localhost:5173",
        "https://devtinder.dpdns.org",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json())
app.use(cookieParser())

const authRouter=require("./router/auth")
const profileRouter=require("./router/profile")
const requestRouter=require("./router/request")
const userRouter=require("./router/user")
const chatRouter=require("./router/chat")
const initializeSocket=require("./util/socket")

app.get("/test", (req, res) => {
    res.send("Server is working");
});

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/",chatRouter)

const server=http.createServer(app)
initializeSocket(server)


connectDB().then(()=>{
    console.log("Database connection established")
    server.listen(7777,()=>{
        console.log("Server is running on port 7777")
    })
})
    .catch((err) => {
        console.error("Database cannot be connected!!");
        console.error(err);
    });

