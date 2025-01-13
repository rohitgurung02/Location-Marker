import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log("Using cached MongoDB connection...");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("Establishing new MongoDB connection...");
      cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
        console.log("MongoDB connected successfully");
        return mongooseInstance;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}


export default connectToDatabase;
