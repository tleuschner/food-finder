import { useState, useEffect } from "react";
import { getNearbyRestaurants } from "./foodService";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  interface Restaurant {
    id: number;
    lat: number;
    lon: number;
    tags: {
      name?: string;
      [key: string]: any;
    };
  }

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (location) {
      const fetchRestaurants = async () => {
        try {
          const nearbyRestaurants = await getNearbyRestaurants(
            location.latitude,
            location.longitude
          );
          console.log({ nearbyRestaurants });
          setRestaurants(nearbyRestaurants);
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      };

      fetchRestaurants();
    }
  }, [location]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <div className="card">
        <button onClick={requestLocation}>Request Location</button>
        {location ? (
          <div>
            <p>
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </p>
            <h2>Nearby Restaurants:</h2>
            <ul>
              {restaurants.map((restaurant) => (
                <li key={restaurant.id}>
                  {restaurant.tags.name || "Unnamed Restaurant"}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
    </>
  );
}

export default App;
