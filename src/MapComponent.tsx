import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface MapComponentProps {
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
}

const MapComponent: React.FC<MapComponentProps> = ({ startPoint, endPoint }) => {
  const RoutingMachine = () => {
    const map = useMap();

    React.useEffect(() => {
      if (!map) return;

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startPoint.lat, startPoint.lng),
          L.latLng(endPoint.lat, endPoint.lng),
        ],
        routeWhileDragging: true,
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }, [map, startPoint, endPoint]);

    return null;
  };

  return (
    <MapContainer
      center={startPoint}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
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
      <RoutingMachine />
    <MapContainer
      center={startPoint}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
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
