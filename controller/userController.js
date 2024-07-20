
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from '../middlewares/errorMiddleware.js'
import { User } from '../models/userSchema.js';
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from 'cloudinary'







export const patientRegister = catchAsyncError(async(req, res, next) => {
    const {firstName, lastName, email, phone, password, gender, dob, nic, role} = req.body; 

    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) 
       { return next(new ErrorHandler("Please Fill Full Form!", 400));}

    let user = await User.findOne({email}); 
    if(user){
        return next(new ErrorHandler("User Already Registered!!", 400));
    }

    user = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, role
    })
    
    generateToken(user, "User Registered!!", 200, res); 
    
}); 

export const handleLogin = catchAsyncError(async(req, res, next) => {
    const {email, password,  role} = req.body; 
    if(!email || !password || !role
     ) {
        return next(new ErrorHandler("Please provide Valid Data to Login", 400));
    }
    
    const user = await User.findOne({email}).select("+password");
    if(!user) {
        return next(new ErrorHandler("Invalid Password or Email !", 400));
    }
        


    const isPasswordMatched = await user.checkPassword(password); 
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password or Email !", 400));
    }
        

    if(role !== user.role){
        return next(new ErrorHandler("No User with provided Role!", 400));
    }

    generateToken(user, "User LoggedIn Successfully!!", 200, res); 

})




export const addNewAdmin = catchAsyncError(async(req, res, next) => {

    const {firstName, lastName, email, phone, password, gender, dob, nic} = req.body; 
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic ) 
        { return next(new ErrorHandler("Please Fill Full Form!", 400));}
    
    const isPatientOrDoctor = await User.findOne({
        email,
        role: { $in: ["Patient"] }
      });

    if(isPatientOrDoctor) {
        return next(new ErrorHandler(`The User with this Email is Patient`, 400))
    }
    const isRegistered = await User.findOne({email, role: "Admin"}); 
    if(isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with This Email Already Exist`, 400))
    }

    const admin = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, role:"Admin"
    })

    res.status(200).json({
        success:true, 
        message: "New Admin Registered!"
    })

})

export const getAllDoctors = catchAsyncError(async(req, res, next) => {
    const doctors = await User.find({role: "Doctor"}); 
    res.status(200).json({
        success: true, 
        doctors
    })
});

export const getUserDetails = catchAsyncError(async(req, res, next) => {
    const user = req.user; 
    res.status(200).json({
        success: true, 
        user
    })
    next(); 
}); 

export const logoutAdmin = catchAsyncError(async(req, res, next) => {
    res.status(200).cookie("adminToken", null, {
        httpOnly: true, 
        expires: new Date(Date.now()), 
        secure: true, 
        sameSite: "None"
    }).json({
        success: true, 
        message: "Admin Logged Out Successfully!!"
    })
})
export const logoutPatient = catchAsyncError(async(req, res, next) => {
    res.status(200).cookie("patientToken", null, {
        httpOnly: true, 
        expires: new Date(Date.now()), 
        secure: true, 
        sameSite: "None"
    }).json({
        success: true, 
        message: "Patient Logged Out Successfully!!"
    })
})

export const addNewDoctor = catchAsyncError(async(req, res, next) => {
   
    if(!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required", 400)); 

    }
    const { docAvatar } = req.files; 

    const allowedFormat = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedFormat.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("Document Format is Not Supported", 400)); 
    }

    const{firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment} = req.body; 

    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) { 
        return next(new ErrorHandler("Please Fill Full Form!", 400));}

    const isRegistered = await User.findOne({email}); 
    if(isRegistered) {
        return next(new ErrorHandler("Doctor Already Exists", 400)); 
    }

    const cloudinaryRes  = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    )

    if(!cloudinaryRes || cloudinaryRes.error){
        console.log('Cloudinary Error: ', cloudinaryRes.error || "Unknown Cloudinary Error");
    }

    const doctor = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment, role:"Doctor", 
        docAvatar: {
            public_id: cloudinaryRes.public_id, 
            url: cloudinaryRes.secure_url,
        }
    })

    res.status(200).json({
        success: true, 
        message: "New Doctor Regisered", 
        doctor,
    })
})














