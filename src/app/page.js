"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [userPosition, setUserPosition] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Check if the code is running on the client-side
  useEffect(() => {
    setIsClient(true); // Mark as client-side after mounting
  }, []);

  // Fetch location data only after the component has mounted on the client
  useEffect(() => {
    if (isClient) {
      const fetchLocations = async () => {
        try {
          const response = await fetch('/api/tracker/route'); // Adjust the API endpoint if needed
          const data = await response.json();
          console.log(data);
          if (data.success) {
            setLocations(data.data); // Set the locations data to the state
          } else {
            console.error('Failed to fetch locations');
          }
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setIsLoading(false); // Set loading to false once data is fetched
        }
      };

      fetchLocations();
    }
  }, [isClient]); // Runs only after component mounts on the client

  // Watch for user geolocation (only on client side)
  useEffect(() => {
    if (isClient && !isLoading && "geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);

          // Check proximity to each location
          locations.forEach((loc) => {
            const distance = getDistance(latitude, longitude, loc.latitude, loc.longitude);
            if (distance < 50) { // 50 meters proximity
              alert(`You are near ${loc.locationName}`);
            }
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, [locations, isLoading, isClient]); // Re-run when locations or isLoading changes

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

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message or spinner while fetching locations
  }

  return (
    <div>
      {isClient ? (
        <Map locations={locations} userPosition={userPosition} />
      ) : null}
    </div>
  );
}
