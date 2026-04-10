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
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

function MapMoveDetector({ onMapMoved, center }) {
  const [showButton, setShowButton] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  useMapEvents({
    moveend(e) {
      const newCenter = e.target.getCenter();
      // Only show the button if the map moved significantly (more than ~500m)
      const dist = Math.sqrt(
        Math.pow(newCenter.lat - center[0], 2) + Math.pow(newCenter.lng - center[1], 2)
      );
      if (dist > 0.005) {
        setMapCenter([newCenter.lat, newCenter.lng]);
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    },
  });

  // Hide button when center prop changes (new search was performed)
  useEffect(() => {
    setShowButton(false);
  }, [center]);

  if (!showButton) return null;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000]">
      <button
        onClick={() => {
          onMapMoved(mapCenter[0], mapCenter[1]);
          setShowButton(false);
        }}
        className="bg-white text-coffee-800 font-semibold px-4 py-2 rounded-full shadow-lg border border-coffee-200 hover:bg-coffee-50 transition-colors text-sm"
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
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            eventHandlers={{
              click: () => onShopClick?.(shop.id),
            }}
          >
            <Popup>
              <div className="font-semibold">{shop.name}</div>
              {shop.openingHours && <div className="text-xs">🕐 {shop.openingHours}</div>}
              <div className="text-xs text-gray-500">{shop.address}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
