const mongoose=require("mongoose")

const connectDB=async ()=>{
    await mongoose.connect("mongodb+srv://devtinder_user:devtinder%402003@devtinder-cluster.jgvc2bs.mongodb.net/devtinder")
}

module.exports=connectDB