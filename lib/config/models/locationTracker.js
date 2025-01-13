import mongoose from "mongoose";

const locationTrackerSchema = new mongoose.Schema({
  longitude: { type: String, required: true },
  latitude: { type: String, required: true },
  potholes: { type: String, required: false },
  animalProneAreas: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.tracker || mongoose.model("tracker", locationTrackerSchema);
