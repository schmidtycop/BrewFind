import { useState } from 'react';

export default function LocationPrompt({ onLocation, onSearchCity }) {
  const [cityQuery, setCityQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocating(false); onLocation(pos.coords.latitude, pos.coords.longitude); },
      () => { setLocating(false); setError('Unable to get your location. Try searching a city instead.'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleCitySearch(e) {
    e.preventDefault();
    if (cityQuery.trim()) onSearchCity(cityQuery.trim());
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-100 to-coffee-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">&#9749;</div>
        <h2 className="text-2xl font-bold text-coffee-800 dark:text-coffee-100 mb-2">Welcome to BrewFind</h2>
        <p className="text-coffee-500 dark:text-coffee-300 mb-6">
          Discover the best coffee shops near you or anywhere you're planning to visit.
        </p>

        <button
          onClick={handleGeolocate}
          disabled={locating}
          className="w-full bg-coffee-700 hover:bg-coffee-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors mb-4 disabled:opacity-50"
        >
          {locating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Finding you...
            </span>
          ) : (
            '📍 Use My Location'
          )}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-coffee-200 dark:border-gray-600" />
          <span className="text-coffee-400 dark:text-coffee-500 text-sm">or search a city</span>
          <hr className="flex-1 border-coffee-200 dark:border-gray-600" />
        </div>

        <form onSubmit={handleCitySearch} className="flex gap-2">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="e.g. New Port Richey, FL"
            className="flex-1 border border-coffee-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-coffee-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 placeholder-coffee-400 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-coffee-900 font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            Go
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
