import mongoose from "mongoose";
import validator from "validator";


const msgSchema = new mongoose.Schema({
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
        required: true,
        validate: [validator.isEmail, "Please Provide a Valid Email Address"]
    }, 
    phone:{
        type: String, 
        required: true, 
        minLength: [10, "Enter Valid Phone Number(containing 10 digits)"]
    }, 
    message: {
        type:String, 
        required: true, 
        minLength: [10, "Message Must contains at least 10 characters!!"]
    }
    
})

const Message = mongoose.model('message', msgSchema); 

export default Message













