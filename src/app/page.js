"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });
const locations = [
  {
    locationLatitude: 32.192147,
    locationLongitude: 76.349229,
    locationName: "Pothole 1",
    locationAreaCategory: "Pothole",
  },
  {
    locationLatitude: 32.193206,
    locationLongitude: 76.347697,
    locationName: "Animal Zone",
    locationAreaCategory: "Animal Prone Area",
  },
];

export default function Home() {
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);

          // Check proximity
          locations.forEach((loc) => {
            const distance = getDistance(latitude, longitude, loc.locationLatitude, loc.locationLongitude);
            if (distance < 50) {
              alert(`You are near ${loc.locationName}`);
            }
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  return <Map locations={locations} userPosition={userPosition} />;
}