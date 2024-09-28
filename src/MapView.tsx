import React from "react";
import { useParams } from "react-router-dom";
import MapComponent from "./MapComponent";
import { Restaurants } from "./types/Restaurants";

interface MapViewProps {
  restaurants: Restaurants[];
  location: { latitude: number; longitude: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ restaurants, location }) => {
  const { id } = useParams<{ id: string }>();
  const restaurant = restaurants.find((r) => r.id === parseInt(id));

  if (!restaurant || !location) return <p>Loading...</p>;

  return (
    <MapComponent
      startPoint={{
        lat: location.latitude,
        lng: location.longitude,
      }}
      endPoint={{ lat: restaurant.lat, lng: restaurant.lon }}
    />
  );
};

export default MapView;
