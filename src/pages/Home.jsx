import { useState } from 'react';
import CoffeeMap from '../components/CoffeeMap';
import CoffeeShopList from '../components/CoffeeShopList';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Home({ shops, center, isSearching, error, isFavorite, onToggleFavorite, onSearchArea }) {
  const [selectedShopId, setSelectedShopId] = useState(null);

  return (
    <>
      {isSearching && <LoadingOverlay />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        <div className="lg:w-3/5 h-[400px] lg:h-auto min-h-[400px] rounded-xl overflow-hidden shadow-md">
          {center ? (
            <CoffeeMap
              shops={shops}
              center={center}
              onShopClick={setSelectedShopId}
              selectedShopId={selectedShopId}
              onSearchArea={onSearchArea}
            />
          ) : (
            <div className="h-full bg-coffee-100 rounded-xl flex items-center justify-center text-coffee-400">
              <p>Search a location to see the map</p>
            </div>
          )}
        </div>

        <div className="lg:w-2/5 lg:max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-coffee-800">
              {shops.length > 0
                ? `${shops.length} Coffee Shops Found`
                : 'Nearby Coffee Shops'}
            </h2>
          </div>
          <CoffeeShopList
            shops={shops}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            selectedShopId={selectedShopId}
            onShopClick={setSelectedShopId}
          />
        </div>
      </div>
    </>
  );
}
