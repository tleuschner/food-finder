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

  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    if (location) {
      const fetchRestaurants = async () => {
        try {
          const nearbyRestaurants = await getNearbyRestaurants(
            location.latitude,
            location.longitude
          );
          setRestaurants(nearbyRestaurants);
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      };

      fetchRestaurants();
    }
  }, [location]);
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
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button onClick={requestLocation}>Request Location</button>
        {location ? (
          <div>
            <p>
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </p>
            <h2>Nearby Restaurants:</h2>
            <ul>
              {restaurants.map((restaurant, index) => (
                <li key={index}>
                  {restaurant.tags.name || "Unnamed Restaurant"}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
      <p>Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
