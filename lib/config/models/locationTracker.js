import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  potholes: {
    type: String,
    required: true,
  },
  animalProneAreas: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const locationTracker =  mongoose.models.tracker || mongoose.model("tracker", LocationSchema);

export default locationTracker