
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true, 
        minLength: [3, "First Name Must Contain At least 3 Length"]
    }, 
    lastName: {
        type:String, 
        minLength: [3, "Last Name must contains at least 3 Characters"]
    }, 
    email: {
        type:String, 
        unique: true, 
        required: true,
        validate: [validator.isEmail, "Please Provide a Valid Email Address"]
    }, 
    phone:{
        type: String, 
        unique: true, 
        required: true, 
        minLength: [10, "Enter Valid Phone Number(containing 10 digits)"],
        maxLength: [10, "Enter Valid Phone Number(containing 10 digits)"]
        
    }, 
    nic: {
        type:String, 
        required: true,
        minLength: [13, "NIC Must contain only 13 Digits"],
        maxLength: [13, "NIC Must contain only 13 Digits"]
    }, 
    dob: {
        type: Date, 
        required: [true, "DOB is required "]
    }, 
    gender: {
        type:String, 
        required: true, 
        enum: ["Male", "Female", "Other"]
    }, 
    password:  {
        type: String, 
        required: true, 
        select: false, 
        minLength: [6, "Password Must Contain at least 6 characters"]
    }, 
    role: {
        type: String, 
        required: true, 
        enum: ["Admin", "Patient", "Doctor"]
    }, 
    doctorDepartment: {
        type:String, 
    }, 
    docAvatar: {
        public_id: String, 
        url: String,
    } 
}); 

//The below function as work before saving the user data registartion the password is hashed or encrypted with other secret key 
//in hash map as used using bcrypt for security purpose
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.checkPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); 
}; 

userSchema.methods.generateJWT  = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {
         expiresIn:process.env.JWT_EXPIRES,
        }
    )
}
export const User = mongoose.model("user", userSchema); 

























