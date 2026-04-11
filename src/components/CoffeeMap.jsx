import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const coffeeIcon = new L.DivIcon({
  html: '<div style="font-size:28px;line-height:1;">&#9749;</div>',
  className: 'coffee-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.DivIcon({
  html: '<div style="font-size:24px;line-height:1;">📍</div>',
  className: 'user-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

function MapMoveDetector({ onMapMoved, center }) {
  const [showButton, setShowButton] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  useMapEvents({
    moveend(e) {
      const c = e.target.getCenter();
      const dist = Math.sqrt((c.lat - center[0]) ** 2 + (c.lng - center[1]) ** 2);
      if (dist > 0.005) {
        setMapCenter([c.lat, c.lng]);
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    },
  });

  useEffect(() => setShowButton(false), [center]);

  if (!showButton) return null;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000]">
      <button
        onClick={() => { onMapMoved(mapCenter[0], mapCenter[1]); setShowButton(false); }}
        className="bg-white dark:bg-gray-800 text-coffee-800 dark:text-coffee-100 font-semibold px-4 py-2 rounded-full shadow-lg border border-coffee-200 dark:border-gray-600 hover:bg-coffee-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        🔍 Search this area
      </button>
    </div>
  );
}

export default function CoffeeMap({ shops, center, onShopClick, selectedShopId, onSearchArea }) {
  if (!center) return null;

  return (
    <div className="relative w-full h-full">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater center={center} />
        <MapMoveDetector onMapMoved={onSearchArea} center={center} />
        <Marker position={center} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.lat, shop.lng]}
            icon={coffeeIcon}
            eventHandlers={{ click: () => onShopClick?.(shop.id) }}
          >
            <Popup>
              <div className="font-semibold">{shop.name}</div>
              {shop.openingHours && <div className="text-xs">🕐 {shop.openingHours}</div>}
              {shop.address && <div className="text-xs text-gray-500">{shop.address}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
