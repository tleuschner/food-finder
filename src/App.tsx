import { useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { getNearbyRestaurants } from "./foodService";
import PrivacyPolicy from "./PrivacyPolicy";
import { recommendRestaurant } from "./recommendationService";
import { Restaurant } from "./types/Restaurants";

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
    { label: "Euphorisch", value: "euphoric" },
    { label: "Melancholisch", value: "melancholic" },
    { label: "Optimistisch", value: "optimistic" },
    { label: "Pessimistisch", value: "pessimistic" },
    { label: "Dankbar", value: "grateful" },
    { label: "Enttäuscht", value: "disappointed" },
    { label: "Erleichtert", value: "relieved" },
    { label: "Besorgt", value: "worried" },
    { label: "Begeistert", value: "enthusiastic" },
    { label: "Gelangweilt", value: "bored" },
  ];

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [recommendedRestaurant, setRecommendedRestaurant] =
    useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

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
          console.log("Got navigator geolocation");
          navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      }
    );

    console.log(currentLocation);
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
      console.log("IM IF, nur recommender aufruf");
      // If the location hasn't changed significantly and restaurants are already fetched
      const recommendedRestaurant = await recommendRestaurant(
        restaurants,
        mood
      );
      setRecommendedRestaurant(recommendedRestaurant);
      setLoading(false);
      return;
    }

    setLocation(newLocation);
    try {
      const nearbyRestaurants = await getNearbyRestaurants(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setLoading(true);
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
                <h2>Wähle Deine Stimmung:</h2>
                <div className="mood-cards">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`mood-card ${
                        selectedMood === mood.value ? "selected" : ""
                      }`}
                      disabled={loading}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
                <h2>Empfohlenes Restaurant:</h2>
                {loading ? (
                  <div className="spinner"></div>
                ) : recommendedRestaurant ? (
                  <div className="restaurant-cards">
                    <Link
                      to={`https://www.google.com/maps/dir/?api=1&origin=${location?.latitude},${location?.longitude}&destination=${recommendedRestaurant.lat},${recommendedRestaurant.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        {recommendedRestaurant.tags["diet:vegetarian"] === "yes"
                          ? "Vegetarian"
                          : ""}
                      </p>
                    </Link>
                  </div>
                ) : (
                  <p>Bitte Stimmung auswählen</p>
                )}
                <footer>
                  <Link to="/datenschutz">Datenschutz</Link>
                </footer>
              </div>
            }
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;
