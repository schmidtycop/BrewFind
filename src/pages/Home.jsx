import { useState } from 'react';
import CoffeeMap from '../components/CoffeeMap';
import CoffeeShopList from '../components/CoffeeShopList';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Home({
  shops,
  center,
  isSearching,
  error,
  isFavorite,
  onToggleFavorite,
  onSearchArea,
  onExpandSearch,
  getNote,
  onSaveNote,
  isVisited,
  visitedDate,
  onToggleVisited,
  getRating,
  onSetRating,
}) {
  const [selectedShopId, setSelectedShopId] = useState(null);

  return (
    <>
      {isSearching && <LoadingOverlay />}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 text-center text-sm">
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
            <div className="h-full bg-coffee-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-coffee-400 dark:text-coffee-500">
              <p>Search a location to see the map</p>
            </div>
          )}
        </div>

        <div className="lg:w-2/5 lg:max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-coffee-800 dark:text-coffee-100">
              {shops.length > 0
                ? `${shops.length} Coffee Shops Found`
                : 'Nearby Coffee Shops'}
            </h2>
          </div>

          {shops.length === 0 && !isSearching && center ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">&#9749;</div>
              <p className="text-coffee-500 dark:text-coffee-400 mb-2">No coffee shops found in this area.</p>
              <p className="text-coffee-400 dark:text-coffee-500 text-sm mb-4">Try expanding the search radius or moving the map.</p>
              <button
                onClick={onExpandSearch}
                className="bg-amber-500 hover:bg-amber-400 text-coffee-900 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                🔍 Search wider area (15km)
              </button>
            </div>
          ) : (
            <CoffeeShopList
              shops={shops}
              center={center}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              selectedShopId={selectedShopId}
              onShopClick={setSelectedShopId}
              getNote={getNote}
              onSaveNote={onSaveNote}
              isVisited={isVisited}
              visitedDate={visitedDate}
              onToggleVisited={onToggleVisited}
              getRating={getRating}
              onSetRating={onSetRating}
            />
          )}
        </div>
      </div>
    </>
  );
}
