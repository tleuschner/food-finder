import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { getNearbyRestaurants } from "./foodService";
import { recommendRestaurant } from "./recommendationService";
import MapView from "./MapView";
import { Restaurants } from "./types/Restaurants";

function App() {
  const moods = [
    { label: "Glücklich", value: "happy" },
    { label: "Traurig", value: "sad" },
    { label: "Aufgeregt", value: "excited" },
    { label: "Entspannt", value: "relaxed" },
  ];

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
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

  const requestLocation = async (mood: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          if (mood) {
            const recommendedRestaurant = await recommendRestaurant(
              filteredRestaurants,
              mood
            );
            if (recommendedRestaurant) {
              // Navigate to the map view with the recommended restaurant
              window.location.href = `/map/${recommendedRestaurant.id}`;
            }
          }
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    requestLocation(mood);
  };
    <Router>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <div className="card">
                <h2>Wählen Sie Ihre Stimmung:</h2>
                <div className="mood-cards">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className="mood-card"
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
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
