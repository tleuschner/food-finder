import { useState, useEffect } from "react";
import { getNearbyRestaurants } from "./foodService";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState({
    vegan: false,
    vegetarian: false,
  });

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

  const handleDietaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDietaryRestrictions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (location) {
      const fetchRestaurants = async () => {
        try {
          const nearbyRestaurants = await getNearbyRestaurants(
            location.latitude,
            location.longitude
          );
          console.log({ nearbyRestaurants });
          const filteredRestaurants = nearbyRestaurants.filter((restaurant) => {
            const { tags } = restaurant;
            if (dietaryRestrictions.vegan && tags["diet:vegan"] !== "yes") {
              return false;
            }
            if (dietaryRestrictions.vegetarian && tags["diet:vegetarian"] !== "yes") {
              return false;
            }
            return true;
          });
          setRestaurants(filteredRestaurants);
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
            <div>
              <label>
                <input
                  type="checkbox"
                  name="vegan"
                  checked={dietaryRestrictions.vegan}
                  onChange={handleDietaryChange}
                />
                Vegan
              </label>
              <label>
                <input
                  type="checkbox"
                  name="vegetarian"
                  checked={dietaryRestrictions.vegetarian}
                  onChange={handleDietaryChange}
                />
                Vegetarian
              </label>
            </div>
            <h2>Nearby Restaurants (Filtered):</h2>
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
