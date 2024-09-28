import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
}

const MapComponent: React.FC<MapComponentProps> = ({ startPoint, endPoint }) => {
  return (
    <MapContainer center={startPoint} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={startPoint}>
        <Popup>Start Point</Popup>
      </Marker>
      <Marker position={endPoint}>
        <Popup>End Point</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
