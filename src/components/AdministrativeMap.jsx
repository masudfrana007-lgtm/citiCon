// src/components/AdministrativeMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue (must be done once per app, safe to keep here)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Red marker icon
const redPinIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const AdministrativeMap = ({ division, district, upazila, union }) => {
  // Generate location key
  const getLocationKey = () => {
    let key = '';
    if (division) key += division;
    if (district) key += '_' + district;
    if (upazila) key += '_' + upazila;
    if (union) key += '_' + union;
    return key;
  };

  // All coordinates live only here
  const coordinates = {
    '': { lat: 23.6850, lon: 90.3563, zoom: 7 },
    Dhaka: { lat: 23.8103, lon: 90.4125, zoom: 8 },
    Dhaka_Dhaka: { lat: 23.8103, lon: 90.4125, zoom: 10 },
    Dhaka_Dhaka_Dhanmondi: { lat: 23.7461, lon: 90.3760, zoom: 13 },
    'Dhaka_Dhaka_Dhanmondi_Ward 47': { lat: 23.7461, lon: 90.3760, zoom: 15 },
    'Dhaka_Dhaka_Dhanmondi_Ward 48': { lat: 23.7461, lon: 90.3760, zoom: 15 },
    Dhaka_Dhaka_Gulshan: { lat: 23.7925, lon: 90.4155, zoom: 13 },
    'Dhaka_Dhaka_Gulshan_Banani': { lat: 23.7938, lon: 90.4053, zoom: 15 },
    'Dhaka_Dhaka_Gulshan_Gulshan-1': { lat: 23.7925, lon: 90.4155, zoom: 15 },
    Dhaka_Dhaka_Mirpur: { lat: 23.8093, lon: 90.3609, zoom: 13 },
    'Dhaka_Dhaka_Mirpur_Mirpur-10': { lat: 23.8069, lon: 90.3681, zoom: 15 },
    Dhaka_Dhaka_Uttara: { lat: 23.8769, lon: 90.4026, zoom: 13 },
    'Dhaka_Dhaka_Uttara_Sector-7': { lat: 23.8678, lon: 90.3969, zoom: 15 },
    Dhaka_Gazipur: { lat: 24.0023, lon: 90.4267, zoom: 10 },
    Chattogram: { lat: 22.3569, lon: 91.7832, zoom: 8 },
    Rajshahi: { lat: 24.3745, lon: 88.6042, zoom: 8 },
    Khulna: { lat: 22.8456, lon: 89.5403, zoom: 8 },
    Sylhet: { lat: 24.8949, lon: 91.8687, zoom: 8 },
  };

  const key = getLocationKey();
  const coords = coordinates[key] || coordinates[''];
  const showMarker = !!union;

  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={coords.zoom}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {showMarker && (
        <Marker position={[coords.lat, coords.lon]} icon={redPinIcon}>
          <Popup>
            <strong>{union}</strong><br />
            {upazila}, {district}, {division}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default AdministrativeMap;