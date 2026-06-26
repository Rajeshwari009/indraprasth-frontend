import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { DEFAULT_MAP_CENTER } from '../../utils/geocoding';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Recenter = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], zoom || map.getZoom());
  }, [lat, lng, zoom, map]);
  return null;
};

const MapView = ({
  lat,
  lng,
  zoom = 15,
  height = '220px',
  className = '',
  interactive = false,
}) => {
  if (!lat || !lng) return null;

  const center = [lat, lng];

  return (
    <div className={`rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-0 ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={lat} lng={lng} zoom={zoom} />
        <Marker position={center} />
      </MapContainer>
    </div>
  );
};

export default MapView;
