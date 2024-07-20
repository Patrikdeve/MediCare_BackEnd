import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true, 
        minLength: [3, "First Name Must Contain At least 3 Length"]
    }, 
    lastName: {
        type:String, 
        required: true, 
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
    appointment_date: {
        type: String, 
        required: true
    }, 
    department: {
        type: String, 
        required: true
    }, 
    doctor: {
        firstName: {
            type:String, 
            required: true
        }, 
        lastName: {
            type: String
        }
    }, 
    hasVisited: {
        type: Boolean, 
        default: false
    }, 
    doctorId: {
        type: mongoose.Schema.ObjectId, 
        required: true
    }, 
    patientId:{
        type: mongoose.Schema.ObjectId, 
        required: true
    }, 
    address: {
        type: String, 
        required: true
    }, 
    status: {
        type: String, 
        enum: ["Accepted", "Rejected", "Pending"], 
        default: "Pending"
    }
}); 


export const Appointment = mongoose.model('appointment', appointmentSchema); 