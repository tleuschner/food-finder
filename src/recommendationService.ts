import ml5 from "ml5";
import { Restaurants } from "./types/Restaurants";

export async function recommendRestaurant(
  restaurants: Restaurants[],
  mood: string
): Promise<Restaurants | null> {
  const sentiment = ml5.sentiment("movieReviews", () => {
    console.log("Sentiment model loaded");
  });

  const moodScore = sentiment.predict(mood).score;

  let bestMatch: Restaurants | null = null;
  let bestScoreDifference = Infinity;

  for (const restaurant of restaurants) {
    const cuisine = restaurant.tags.cuisine || "";
    const cuisineScore = sentiment.predict(cuisine).score;
    const scoreDifference = Math.abs(moodScore - cuisineScore);

    if (scoreDifference < bestScoreDifference) {
      bestScoreDifference = scoreDifference;
      bestMatch = restaurant;
    }
  }

  return bestMatch;
}
