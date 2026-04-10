import { useState } from 'react';

export default function AppHeader({ onSearchCity, onShowFavorites, showingFavorites, onResetLocation, dark, onToggleDark }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      onSearchCity(query.trim());
      setQuery('');
    }
  }

  return (
    <header className="bg-coffee-800 dark:bg-gray-900 text-white px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-2xl">&#9749;</span> BrewFind
        </h1>

        <form onSubmit={handleSubmit} className="flex-1 max-w-md min-w-[200px]">
          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city or neighborhood..."
              className="flex-1 px-3 py-2 rounded-l-lg bg-white dark:bg-gray-700 text-coffee-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-coffee-400 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-coffee-900 px-4 py-2 rounded-r-lg font-medium text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="text-lg hover:scale-110 transition-transform"
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={onResetLocation}
            className="text-sm bg-coffee-600 dark:bg-gray-700 hover:bg-coffee-500 dark:hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
            title="Change location"
          >
            📍 Reset
          </button>
          <button
            onClick={onShowFavorites}
            className={`text-2xl transition-transform hover:scale-110 ${
              showingFavorites ? 'drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]' : ''
            }`}
            title="Favorites"
          >
            {showingFavorites ? '💛' : '🤍'}
          </button>
        </div>
      </div>
    </header>
  );
}
