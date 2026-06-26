const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export const DEFAULT_MAP_CENTER = { lat: 23.2599, lng: 77.4126, zoom: 13 };

export const parseNominatimResult = (result) => {
  const addr = result.address || {};
  const street = [addr.house_number, addr.road, addr.neighbourhood, addr.suburb]
    .filter(Boolean)
    .join(', ');

  return {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    label: result.display_name,
    street: street || result.display_name.split(',')[0] || '',
    city: addr.city || addr.town || addr.village || addr.county || '',
    state: addr.state || '',
    pincode: addr.postcode || '',
  };
};

export const searchPlaces = async (query) => {
  if (!query || query.trim().length < 3) return [];
  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    addressdetails: '1',
    countrycodes: 'in',
    limit: '6',
  });
  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) return [];
  return res.json();
};

export const reverseGeocode = async (lat, lng) => {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
  });
  const res = await fetch(`${NOMINATIM_URL}/reverse?${params}`, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data ? parseNominatimResult(data) : null;
};
