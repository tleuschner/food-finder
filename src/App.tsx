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
    { label: "Wütend", value: "angry" },
    { label: "Verwirrt", value: "confused" },
    { label: "Erschöpft", value: "exhausted" },
    { label: "Zufrieden", value: "content" },
    { label: "Gestresst", value: "stressed" },
    { label: "Neugierig", value: "curious" },
    { label: "Nostalgisch", value: "nostalgic" },
    { label: "Motiviert", value: "motivated" },
    { label: "Gelassen", value: "calm" },
    { label: "Überrascht", value: "surprised" },
  ];

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [recommendedRestaurant, setRecommendedRestaurant] =
    useState<Restaurants | null>(null);
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

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  };

  const requestLocation = async (mood: string) => {
    const currentLocation = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      }
    );

    const newLocation = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    if (
      location &&
      calculateDistance(
        location.latitude,
        location.longitude,
        newLocation.latitude,
        newLocation.longitude
      ) < 500 &&
      restaurants.length > 0
    ) {
      // If the location hasn't changed significantly and restaurants are already fetched
      const recommendedRestaurant = await recommendRestaurant(
        restaurants,
        mood
      );
      setRecommendedRestaurant(recommendedRestaurant);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocation(newLocation);
          try {
            const nearbyRestaurants = await getNearbyRestaurants(
              position.coords.latitude,
              position.coords.longitude
            );
            setRestaurants(nearbyRestaurants);

            if (mood) {
              const recommendedRestaurant = await recommendRestaurant(
                nearbyRestaurants,
                mood
              );

              if (recommendedRestaurant) {
                setRecommendedRestaurant(recommendedRestaurant);
              }
            }
          } catch (error) {
            console.error("Error fetching restaurants:", error);
          }
        },
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
  return (
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
                {recommendedRestaurant ? (
                  <div>
                    <h2>Empfohlenes Restaurant:</h2>
                    <div className="restaurant-cards">
                      <Link
                        to={`/map/${recommendedRestaurant.id}`}
                        className="restaurant-card"
                      >
                        <h3>
                          {recommendedRestaurant.tags.name ||
                            "Unnamed Restaurant"}
                        </h3>
                        <p>
                          {recommendedRestaurant.tags.cuisine ||
                            "Cuisine not specified"}
                        </p>
                        <p>
                          {recommendedRestaurant.tags["diet:vegan"] === "yes"
                            ? "Vegan"
                            : ""}
                          {recommendedRestaurant.tags["diet:vegetarian"] ===
                          "yes"
                            ? "Vegetarian"
                            : ""}
                        </p>
                      </Link>
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
