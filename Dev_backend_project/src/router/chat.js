const express=require("express")
const {userAuth} = require("../middlerware/auth");
const {Chat} = require("../models/chat");
const ConnectionRequest=require("../models/connectionRequest")
const chatRouter=express.Router()


chatRouter.get("/chat/:targetUserId",userAuth,async (req,res)=>{
    const {targetUserId}=req.params
    const userId =req.user._id

    try{

        // Check if they are connected
        const connection = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId: userId,
                    toUserId: targetUserId,
                    status: "accepted"
                },
                {
                    fromUserId: targetUserId,
                    toUserId: userId,
                    status: "accepted"
                }
            ]
        });

        if (!connection) {
            return res.status(403).json({
                message: "You can only chat with your connections"
            });
        }


        let chat=await Chat.findOne({
            participants:{$all : [userId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName",
        }).slice("messages", -50);

        if(!chat){
            chat=new Chat({
                participants:[userId,targetUserId],
                messages:[],
            })
            await chat.save()
        }
        res.json(chat)

    }catch (err){
        console.log(err)
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        })
    }
})

module.exports=chatRouter