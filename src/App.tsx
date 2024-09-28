import { useEffect, useState } from "react";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";
import { getNearbyRestaurants } from "./foodService";
import MapView from "./MapView";
import MapComponent from "./MapComponent";
import { Restaurants } from "./types/Restaurants";

function App() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState({
    vegan: false,
    vegetarian: false,
  });

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [restaurants, setRestaurants] = useState<Restaurants[]>([]);

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
          const filteredRestaurants = nearbyRestaurants.filter((restaurant) => {
            const { tags } = restaurant;
            if (dietaryRestrictions.vegan && tags["diet:vegan"] !== "yes") {
              return false;
            }
            if (
              dietaryRestrictions.vegetarian &&
              tags["diet:vegetarian"] !== "yes"
            ) {
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
  }, [location, dietaryRestrictions]);

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
    <Router>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <div className="card">
                <button onClick={requestLocation}>Request Location</button>
                {location ? (
                  <div>
                    <p>
                      Latitude: {location.latitude}, Longitude:{" "}
                      {location.longitude}
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
                    <div className="restaurant-cards">
                      {restaurants.map((restaurant) => (
                        <Link
                          key={restaurant.id}
                          to={`/map/${restaurant.id}`}
                          className="restaurant-card"
                        >
                          <h3>
                            {restaurant.tags.name || "Unnamed Restaurant"}
                          </h3>
                          <p>
                            {restaurant.tags.cuisine || "Cuisine not specified"}
                          </p>
                          <p>
                            {restaurant.tags["diet:vegan"] === "yes"
                              ? "Vegan"
                              : ""}
                            {restaurant.tags["diet:vegetarian"] === "yes"
                              ? "Vegetarian"
                              : ""}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>Loading location...</p>
                )}
              </div>
            }
          />
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
                <div className="restaurant-cards">
                  {restaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/map/${restaurant.id}`}
                      className="restaurant-card"
                    >
                      <h3>{restaurant.tags.name || "Unnamed Restaurant"}</h3>
                      <p>
                        {restaurant.tags.cuisine || "Cuisine not specified"}
                      </p>
                      <p>
                        {restaurant.tags["diet:vegan"] === "yes" ? "Vegan" : ""}
                        {restaurant.tags["diet:vegetarian"] === "yes"
                          ? "Vegetarian"
                          : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p>Loading location...</p>
            )}
          </div>
          <Route
            path="/map/:id"
            element={<MapView restaurants={restaurants} location={location} />}
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;
