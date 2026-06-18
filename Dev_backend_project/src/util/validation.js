const validator=require("validator")


const validatorSingUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body

    if(!firstName || !lastName){
        throw new Error("Name is not found")
    }else if (!validator.isEmail(emailId)){
        throw new Error("Invalid email address")
    }else  if(!validator.isStrongPassword(password)){
        throw new Error("enter strong password")
    }

}

const validatorEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","age","gender","photoUrl","about","skills"]

    const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditFields.includes(field))

    return isEditAllowed
}

module.exports={validatorSingUpData,validatorEditProfileData}