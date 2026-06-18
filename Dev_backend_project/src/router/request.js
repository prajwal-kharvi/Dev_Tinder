const express=require("express")
const requestRouter=express.Router()
const{userAuth}=require("../middlerware/auth")


requestRouter.post("/sendConnectionRequest",userAuth ,async (req,res)=>{
    try {
        const user=req.user
        res.send(user.firstName+": send the connect request")
    }
    catch (err){
        res.status(404).send("connection failed")
    }

})

module.exports=requestRouter