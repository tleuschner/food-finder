//@ts-nocheck
import { Restaurant } from "./types/Restaurants";

export async function recommendRestaurant(
  restaurants: Restaurant[],
  mood: string
): Promise<Restaurant | null> {
  return new Promise<Restaurant | null>((resolve, reject) => {
    ml5.sentiment("MovieReviews", async (model) => {
      const { confidence: moodScore } = await model.predict(mood);
      let bestMatch: Restaurant | null = null;
      let bestScoreDifference = Infinity;

      for (const restaurant of restaurants) {
        const cuisine = restaurant.tags.cuisine || "";
        const { confidence: cuisineScore } = await model.predict(cuisine);
        const scoreDifference = Math.abs(moodScore - cuisineScore);

        if (scoreDifference < bestScoreDifference) {
          bestScoreDifference = scoreDifference;
          bestMatch = restaurant;
        }
      }

      resolve(bestMatch);
    });
  });
}
