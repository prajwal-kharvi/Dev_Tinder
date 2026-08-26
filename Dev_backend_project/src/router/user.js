const express=require("express")
const userRouter=express.Router()
const {userAuth}=require("../middlerware/auth")
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")

const User_Safe_Data="firstName lastName age gender photoUrl about skills"

//getting all the pending/interested connection  request for the loggedIN user
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user

        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId", User_Safe_Data)

        res.json({message:"Data fetch successfully",connectionRequest})

    }catch (err){
        res.status(404).send("ERROR :"+err.message)
    }
})

userRouter.get("/user/connection",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",User_Safe_Data).populate("toUserId",User_Safe_Data)

        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({data})
    }catch (err){
        res.status(404).send("ERROR :"+err.message)
    }
})

userRouter.get("/feed",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user

        // console.log("COOKIES RECEIVED:", req.cookies);
        // console.log("TOKEN RECEIVED:", req.cookies.token);

        const page=parseInt(req.query.page) ||1
        let limit=parseInt(req.query.limit)||10
        limit=limit>50?50:limit
        const skip=(page-1)*limit

        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed=new Set()
        connectionRequests.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })

        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ],
        }).select(User_Safe_Data).skip(skip).limit(limit)

        res.send(users)

    }catch (err){
        res.status(404).send("ERROR"+err.message)
    }
})

module.exports=userRouter