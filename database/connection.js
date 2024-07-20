import mongoose from "mongoose";

export const ConnectMongoDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN-HOSPITAL-MANAGMENT-SYSTEM"
    }).then(()=> {
        console.log('MongoDB Connected Successfully'); 
    }).catch(err => {
        console.log(`MongoDB connection UnSuccessful. Error: ${err}`)
    })
}