// components/Map.js
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ locations, userPosition }) => {
  return (
    <MapContainer center={userPosition} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((loc, index) => (
        <Marker key={index} position={[loc.locationLatitude, loc.locationLongitude]}>
          <Popup>{loc.locationName}</Popup>
        </Marker>
      ))}
      {userPosition && (
        <Marker position={userPosition}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
