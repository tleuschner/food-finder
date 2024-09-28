import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { getNearbyRestaurants } from "./foodService";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
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
      <Switch>
        <Route path="/" exact>
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
                      <p>{restaurant.tags.cuisine || "Cuisine not specified"}</p>
                      <p>
                        {restaurant.tags["diet:vegan"] === "yes" ? "Vegan" : ""}
                        {restaurant.tags["diet:vegetarian"] === "yes" ? "Vegetarian" : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p>Loading location...</p>
            )}
          </div>
        </Route>
        <Route path="/map/:id" render={({ match }) => {
          const restaurant = restaurants.find(r => r.id === parseInt(match.params.id));
          if (!restaurant || !location) return <p>Loading...</p>;
          return (
            <MapComponent
              startPoint={{ lat: location.latitude, lng: location.longitude }}
              endPoint={{ lat: restaurant.lat, lng: restaurant.lon }}
            />
          );
        }} />
      </Switch>
    </>
  );
}

export default App;
