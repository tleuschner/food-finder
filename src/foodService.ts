const BASE_URL = 'https://overpass-api.de/api/interpreter';

export async function getNearbyRestaurants(latitude: number, longitude: number, radius: number = 1500) {
    const query = `
        [out:json];
        node["amenity"="restaurant"](around:${radius},${latitude},${longitude});
        out;
    `;
    const url = `${BASE_URL}?data=${encodeURIComponent(query)}`;

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
