"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function Home() {
  const [userPosition, setUserPosition] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/tracker");
        const data = await response.json();

        if (data.success) {
          const validLocations = data.data.map((loc) => ({
            locationLatitude: parseFloat(loc.latitude),
            locationLongitude: parseFloat(loc.longitude),
            locationName: loc.potholes || loc.animalProneAreas,
          }));
          setLocations(validLocations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (!isLoading && navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, [isLoading]);

  if (isLoading || !userPosition) {
    return <div>Loading map and data...</div>;
  }

  return (
    <div>
      <MapContainer center={userPosition} zoom={15} style={{ height: "100vh", width: "100vw" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.locationLatitude, loc.locationLongitude]}>
            <Popup>{loc.locationName}</Popup>
          </Marker>
        ))}
        <Marker position={userPosition}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
