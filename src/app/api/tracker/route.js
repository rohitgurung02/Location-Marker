import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/config/db";
import locationTracker from "../../../../lib/config/models/locationTracker";

export async function GET(request) {
  console.log('location added')
  return NextResponse.json({msg:'API Working'})
}

// through this function it's connect to the DataBase(Mongo DB);
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

// In this method we can store the data into the DataBase.
export async function POST(request) {
  // We get the data as a (Form Data)
  const formData = await request.formData();

  // We can get the (Date and Current Time)
  const timestamp = Date.now();

  const location = {
    longitude: `${formData.get("longitude")}`,
    latitude: `${formData.get("latitude")}`,
    potholes: `${formData.get("potholes")}`,
    animalProneAreas: `${formData.get("animalProneAreas")}`,
  };

  // Save to MongoDB
  await locationTracker.create(location);
  console.log("Location Saved");

  return NextResponse.json({ success: true, msg: "All Data Added" });
}


