const express=require("express")
const requestRouter=express.Router()
const{userAuth}=require("../middlerware/auth")
const ConnectionRequest =require("../models/connectionRequest")
const User=require("../models/user")



requestRouter.post("/request/send/:status/:toUserId",userAuth ,async (req,res)=>{
    try {
        const fromUserId=req.user._id
        const toUserId=req.params.toUserId
        const status=req.params.status

        const allowedStatus=["ignore","interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type"+status})
        }

        const toUser=await User.findById(toUserId)
        if(!toUser){
            return res.status(404).send({message:"user not found"})

        }

        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or :[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        })
        if(existingConnectionRequest){
            return res.status(404).send({message:"Connection request already exists!!!"})
        }

        const connectionRequest=await new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await connectionRequest.save()

        res.json({message:req.user.firstName +" is "+status+" in" + toUser.firstName,connectionRequest})

    }
    catch (err){
        res.status(404).send("connection failed")
    }

})

module.exports=requestRouter