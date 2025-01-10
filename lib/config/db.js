import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://rohitgurung086:MMYNoejudOGtbVxT@cluster0.elwhn.mongodb.net/location-tracker');
    console.log('DB Connected');
}