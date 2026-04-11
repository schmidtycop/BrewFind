import { useState } from 'react';
import CoffeeShopCard from './CoffeeShopCard';
import { getDistanceMiles } from '../api/places';

export default function CoffeeShopList({
  shops,
  center,
  isFavorite,
  onToggleFavorite,
  selectedShopId,
  onShopClick,
  getNote,
  onSaveNote,
  isVisited,
  visitedDate,
  onToggleVisited,
  getRating,
  onSetRating,
}) {
  const [sortBy, setSortBy] = useState('distance');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterVisited, setFilterVisited] = useState('all'); // 'all' | 'visited' | 'new'

  // Enrich shops with distance
  const enriched = shops.map((shop) => ({
    ...shop,
    distance: center ? getDistanceMiles(center[0], center[1], shop.lat, shop.lng) : null,
  }));

  // Filter: open now
  let filtered = filterOpen ? enriched.filter((s) => s.isOpen === true) : enriched;

  // Filter: visited status
  if (filterVisited === 'visited') {
    filtered = filtered.filter((s) => isVisited?.(s.id));
  } else if (filterVisited === 'new') {
    filtered = filtered.filter((s) => !isVisited?.(s.id));
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'distance') return (a.distance ?? 999) - (b.distance ?? 999);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  if (shops.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs bg-white dark:bg-gray-700 border border-coffee-200 dark:border-gray-600 text-coffee-800 dark:text-coffee-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="distance">Sort: Nearest</option>
          <option value="name">Sort: A-Z</option>
          <option value="rating">Sort: Rating</option>
        </select>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
            filterOpen
              ? 'bg-green-500 text-white'
              : 'bg-white dark:bg-gray-700 border border-coffee-200 dark:border-gray-600 text-coffee-800 dark:text-coffee-100'
          }`}
        >
          {filterOpen ? '✓ Open Now' : 'Open Now'}
        </button>
        <select
          value={filterVisited}
          onChange={(e) => setFilterVisited(e.target.value)}
          className="text-xs bg-white dark:bg-gray-700 border border-coffee-200 dark:border-gray-600 text-coffee-800 dark:text-coffee-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">All Shops</option>
          <option value="visited">Been There</option>
          <option value="new">Not Visited</option>
        </select>
        <span className="text-xs text-coffee-400 dark:text-coffee-400 ml-auto">
          {filtered.length} of {shops.length} shown
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-coffee-400 dark:text-coffee-500">
            <p>No shops match your filters. Try adjusting them.</p>
          </div>
        ) : (
          filtered.map((shop) => (
            <CoffeeShopCard
              key={shop.id}
              shop={shop}
              isFavorite={isFavorite(shop.id)}
              onToggleFavorite={onToggleFavorite}
              isSelected={selectedShopId === shop.id}
              onClick={onShopClick}
              distance={shop.distance}
              note={getNote(shop.id)}
              onSaveNote={onSaveNote}
              isVisited={isVisited?.(shop.id)}
              visitedDate={visitedDate?.(shop.id)}
              onToggleVisited={onToggleVisited}
              userRating={getRating?.(shop.id)}
              onSetRating={onSetRating}
            />
          ))
        )}
      </div>
    </div>
  );
}
