const mongoose =require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter strong password")
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://media.istockphoto.com/id/587805156/vector/profile-picture-vector-illustration.jpg?s=612x612&w=0&k=20&c=gkvLDCgsHH-8HeQe7JsjhlOY6vRBJk_sKW9lyaLgmLo=",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL")
            }
        }

    },
    about:{
        type:String,
        default:"This is default about the user!!"
    },
    skills:{
        type:[String],

    },
},{
    timestamps:true,
})

userSchema.methods.getJWT=async function(){
    const user=this
    const token= await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})

    return token
}

userSchema.methods.validatepassword=async function(passwordInputByUser){
    const user=this
    const passwordHash=user.password

    const isValidPassword= await  bcrypt.compare(passwordInputByUser,passwordHash);
    return isValidPassword
}

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)

}

userSchema.methods.getPasswordHash=async function(password){
    return await bcrypt.hash(password,10)
}

module.exports=mongoose.model("User",userSchema);