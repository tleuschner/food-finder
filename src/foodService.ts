import fetch from 'node-fetch';

const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

export async function getNearbyRestaurants(latitude: number, longitude: number, radius: number = 1500) {
    const url = `${BASE_URL}?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        throw error;
    }
}
