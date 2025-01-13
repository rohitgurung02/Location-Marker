import { NextResponse } from "next/server";
import mongoDB from "../../../../lib/mongoDB/mongoDB";
import locationTracker from "../../../../lib/config/models/locationTracker";

export async function GET() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoDB();

    console.log("Fetching location data...");
    const locations = await locationTracker.find();

    console.log("Fetched locations:", locations);
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error("Error fetching location data:", error);
    return NextResponse.json(
      { success: false, msg: "Error fetching data" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  // Get the data as Form Data
  const formData = await request.formData();

  // Get the current timestamp
  const timestamp = Date.now();

  // Prepare location data
  const location = {
    longitude: `${formData.get("longitude")}`,
    latitude: `${formData.get("latitude")}`,
    potholes: `${formData.get("potholes")}`,
    animalProneAreas: `${formData.get("animalProneAreas")}`,
  };

  // Connect to MongoDB
  await mongoDB();

  // Save to Config/Models/locationTracker
  await locationTracker.create(location);
  console.log("Location Saved");

  return NextResponse.json({ success: true, msg: "All Data Added" });
}
