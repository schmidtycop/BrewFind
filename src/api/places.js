const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

export async function searchNearbyCoffeeShops(lat, lng, radius = 3000) {
  // Bounding box is faster than "around" queries
  const latDelta = radius / 111320;
  const lngDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));
  const bbox = `${lat - latDelta},${lng - lngDelta},${lat + latDelta},${lng + lngDelta}`;

  const query = `[out:json][timeout:10];node["amenity"="cafe"](${bbox});out body 25;`;

  let lastError;
  for (const server of OVERPASS_SERVERS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(
        `${server}?data=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!response.ok) {
        lastError = new Error(`Overpass error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      return (data.elements || []).map(formatOverpassPlace);
    } catch (error) {
      lastError = error;
    }
  }

  console.error('All Overpass servers failed:', lastError);
  throw lastError;
}

export async function searchCoffeeShopsByCity(cityQuery) {
  const geoResponse = await fetch(
    `${NOMINATIM_API}?q=${encodeURIComponent(cityQuery)}&format=json&limit=1`
  );

  if (!geoResponse.ok) throw new Error('Geocoding failed');

  const geoData = await geoResponse.json();
  if (geoData.length === 0) throw new Error('Location not found');

  const { lat, lon } = geoData[0];
  return searchNearbyCoffeeShops(parseFloat(lat), parseFloat(lon));
}

function formatOverpassPlace(element) {
  const tags = element.tags || {};

  return {
    id: `osm-${element.id}`,
    name: tags.name || tags['name:en'] || 'Coffee Shop',
    address: buildAddress(tags),
    lat: element.lat,
    lng: element.lon,
    rating: null,
    reviewCount: 0,
    priceLevel: null,
    isOpen: null,
    photoRef: null,
    website: tags.website || tags['contact:website'] || null,
    phone: tags.phone || tags['contact:phone'] || null,
    openingHours: tags.opening_hours || null,
  };
}

function buildAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
  ].filter(Boolean);

  const cityParts = [
    tags['addr:city'],
    tags['addr:state'],
    tags['addr:postcode'],
  ].filter(Boolean);

  if (parts.length === 0 && cityParts.length === 0) return '';

  return [parts.join(' '), cityParts.join(', ')].filter(Boolean).join(', ');
}
