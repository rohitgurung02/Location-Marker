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
  const [alertedLocations, setAlertedLocations] = useState(new Set());

  // Haversine formula to calculate distance in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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
          console.log("Fetched locations:", validLocations);
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
          console.log("User position updated:", latitude, longitude);
          setUserPosition([latitude, longitude]);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, [isLoading]);

  useEffect(() => {
    if (userPosition) {
      locations.forEach((loc, index) => {
        const distance = calculateDistance(
          userPosition[0],
          userPosition[1],
          loc.locationLatitude,
          loc.locationLongitude
        );

        console.log(
          `Distance to ${loc.locationName}: ${distance.toFixed(2)} meters`
        );

        if (distance <= 50 && !alertedLocations.has(index)) {
          alert(`You are within 20 meters of: ${loc.locationName}`);
          setAlertedLocations((prev) => new Set(prev).add(index));
        }
      });
    }
  }, [userPosition, locations, alertedLocations]);

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
