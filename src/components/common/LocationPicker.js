import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Loader2 } from 'lucide-react';
import {
  DEFAULT_MAP_CENTER,
  searchPlaces,
  reverseGeocode,
  parseNominatimResult,
} from '../../utils/geocoding';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const place = await reverseGeocode(lat, lng);
      onPick(place || { lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    },
  });
  return null;
};

const LocationPicker = ({
  value,
  onChange,
  label = 'Search delivery location',
  helperText = 'Search like Rapido/Uber — pick your exact spot on the map',
  mapHeight = '260px',
  compact = false,
}) => {
  const [query, setQuery] = useState(value?.label || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  const lat = value?.lat ?? DEFAULT_MAP_CENTER.lat;
  const lng = value?.lng ?? DEFAULT_MAP_CENTER.lng;

  const applyPlace = useCallback((place) => {
    if (!place?.lat || !place?.lng) return;
    onChange(place);
    setQuery(place.label || '');
    setOpen(false);
    setResults([]);
  }, [onChange]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
      setResults([]);
      return undefined;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchPlaces(query);
        setResults(data.map(parseNominatimResult));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="space-y-3">
      {!compact && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <MapPin size={15} className="text-blue-600" />
            {label}
          </label>
          {helperText && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{helperText}</p>
          )}
        </div>
      )}

      <div ref={wrapperRef} className="relative">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search area, landmark, street… e.g. Jawahar Chowk Bhopal"
            className="input-field pl-10 pr-10"
          />
          {searching && (
            <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
          )}
        </div>

        {open && results.length > 0 && (
          <ul className="absolute z-[500] mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-52 overflow-y-auto">
            {results.map((place) => (
              <li key={`${place.lat}-${place.lng}-${place.label}`}>
                <button
                  type="button"
                  onClick={() => applyPlace(place)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{place.label.split(',')[0]}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{place.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0" style={{ height: mapHeight }}>
        <MapContainer
          center={[lat, lng]}
          zoom={value?.lat ? 16 : DEFAULT_MAP_CENTER.zoom}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={applyPlace} />
          {value?.lat && value?.lng && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
        <p className="absolute bottom-2 left-2 right-2 text-center text-[10px] bg-white/90 dark:bg-gray-900/90 text-gray-500 rounded-lg py-1 px-2 pointer-events-none">
          Tap on map to fine-tune pin location
        </p>
      </div>

      {value?.lat && value?.lng && (
        <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
          <MapPin size={14} className="shrink-0 mt-0.5" />
          <span className="line-clamp-2">{value.label || 'Location pinned on map'}</span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
