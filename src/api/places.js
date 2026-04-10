const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';

// Use Google Places if key is available, otherwise Overpass
const useGoogle = !!GOOGLE_PLACES_API_KEY;

export async function searchNearbyCoffeeShops(lat, lng, radius = 8000) {
  if (useGoogle) return googleNearbySearch(lat, lng, radius);
  return overpassSearch(lat, lng, radius);
}

export async function searchCoffeeShopsByCity(cityQuery) {
  if (useGoogle) return googleTextSearch(cityQuery);

  const geoResponse = await fetch(
    `${NOMINATIM_API}?q=${encodeURIComponent(cityQuery)}&format=json&limit=1`
  );
  if (!geoResponse.ok) throw new Error('Geocoding failed');
  const geoData = await geoResponse.json();
  if (geoData.length === 0) throw new Error('Location not found');
  const { lat, lon } = geoData[0];
  return overpassSearch(parseFloat(lat), parseFloat(lon), 8000);
}

// Calculate distance in miles between two points
export function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Parse OSM opening_hours to check if currently open
export function parseIsOpen(openingHours) {
  if (!openingHours) return null;
  try {
    const now = new Date();
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = dayNames[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Handle simple formats like "Mo-Fr 08:00-19:00; Sa 09:00-17:00"
    const rules = openingHours.split(';').map((r) => r.trim());
    for (const rule of rules) {
      const match = rule.match(/^([A-Za-z, -]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
      if (!match) continue;

      const [, daysPart, openTime, closeTime] = match;
      const openMin = timeToMinutes(openTime);
      const closeMin = timeToMinutes(closeTime);

      if (dayRangeIncludes(daysPart, today)) {
        return currentMinutes >= openMin && currentMinutes <= closeMin;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function dayRangeIncludes(daysPart, today) {
  const allDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const segments = daysPart.split(',').map((s) => s.trim());
  for (const seg of segments) {
    if (seg.includes('-')) {
      const [start, end] = seg.split('-').map((d) => d.trim());
      const si = allDays.indexOf(start);
      const ei = allDays.indexOf(end);
      const ti = allDays.indexOf(today);
      if (si <= ei) {
        if (ti >= si && ti <= ei) return true;
      } else {
        if (ti >= si || ti <= ei) return true;
      }
    } else if (seg.trim() === today) {
      return true;
    }
  }
  return false;
}

// --- Overpass (free) ---

async function overpassSearch(lat, lng, radius) {
  const latDelta = radius / 111320;
  const lngDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));
  const bbox = `${lat - latDelta},${lng - lngDelta},${lat + latDelta},${lng + lngDelta}`;
  const query = `[out:json][timeout:12];node["amenity"="cafe"](${bbox});out body 30;`;

  let lastError;
  for (const server of OVERPASS_SERVERS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 14000);
      const response = await fetch(
        `${server}?data=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (!response.ok) { lastError = new Error(`Overpass: ${response.status}`); continue; }
      const data = await response.json();
      return (data.elements || []).map(formatOverpassPlace);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function formatOverpassPlace(el) {
  const t = el.tags || {};
  const openingHours = t.opening_hours || null;
  return {
    id: `osm-${el.id}`,
    name: t.name || t['name:en'] || 'Coffee Shop',
    address: buildAddress(t),
    lat: el.lat,
    lng: el.lon,
    rating: null,
    reviewCount: 0,
    priceLevel: null,
    isOpen: parseIsOpen(openingHours),
    website: t.website || t['contact:website'] || null,
    phone: t.phone || t['contact:phone'] || null,
    openingHours,
  };
}

function buildAddress(t) {
  const street = [t['addr:housenumber'], t['addr:street']].filter(Boolean);
  const city = [t['addr:city'], t['addr:state'], t['addr:postcode']].filter(Boolean);
  if (!street.length && !city.length) return '';
  return [street.join(' '), city.join(', ')].filter(Boolean).join(', ');
}

// --- Google Places (optional upgrade) ---

async function googleNearbySearch(lat, lng, radius) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.id',
    },
    body: JSON.stringify({
      includedTypes: ['cafe', 'coffee_shop'],
      maxResultCount: 20,
      locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius } },
    }),
  });
  if (!res.ok) throw new Error(`Google Places: ${res.status}`);
  const data = await res.json();
  return (data.places || []).map(formatGooglePlace);
}

async function googleTextSearch(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.id',
    },
    body: JSON.stringify({ textQuery: `coffee shops in ${query}`, maxResultCount: 20 }),
  });
  if (!res.ok) throw new Error(`Google Places: ${res.status}`);
  const data = await res.json();
  return (data.places || []).map(formatGooglePlace);
}

const priceMap = { PRICE_LEVEL_INEXPENSIVE: '$', PRICE_LEVEL_MODERATE: '$$', PRICE_LEVEL_EXPENSIVE: '$$$', PRICE_LEVEL_VERY_EXPENSIVE: '$$$$' };

function formatGooglePlace(p) {
  return {
    id: p.id,
    name: p.displayName?.text || 'Unknown',
    address: p.formattedAddress || '',
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    rating: p.rating || null,
    reviewCount: p.userRatingCount || 0,
    priceLevel: priceMap[p.priceLevel] || null,
    isOpen: p.currentOpeningHours?.openNow ?? null,
    website: null,
    phone: null,
    openingHours: null,
  };
}
