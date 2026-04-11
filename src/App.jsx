import { useState } from 'react';
import AppHeader from './components/AppHeader';
import LocationPrompt from './components/LocationPrompt';
import InstallGuide from './components/InstallGuide';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { useFavorites } from './hooks/useFavorites';
import { useNotes } from './hooks/useNotes';
import { useDarkMode } from './hooks/useDarkMode';
import { searchNearbyCoffeeShops, searchCoffeeShopsByCity } from './api/places';

function App() {
  const [locationSet, setLocationSet] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [shops, setShops] = useState([]);
  const [center, setCenter] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { getNote, setNote } = useNotes();
  const [dark, toggleDark] = useDarkMode();

  async function handleNearbySearch(lat, lng, radius) {
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchNearbyCoffeeShops(lat, lng, radius);
      setShops(results);
      setCenter([lat, lng]);
    } catch {
      setError('Failed to find coffee shops. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  async function handleCitySearch(query) {
    setIsSearching(true);
    setError(null);
    setShowFavorites(false);
    try {
      const results = await searchCoffeeShopsByCity(query);
      if (results.length > 0) {
        setCenter([results[0].lat, results[0].lng]);
      }
      setShops(results);
    } catch {
      setError('Failed to search that location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  function handleLocation(lat, lng) {
    setLocationSet(true);
    handleNearbySearch(lat, lng);
  }

  function handleCitySearchFromPrompt(query) {
    setLocationSet(true);
    handleCitySearch(query);
  }

  function handleExpandSearch() {
    if (center) handleNearbySearch(center[0], center[1], 15000);
  }

  if (!locationSet) {
    return (
      <LocationPrompt
        onLocation={handleLocation}
        onSearchCity={handleCitySearchFromPrompt}
      />
    );
  }

  return (
    <div className="min-h-screen bg-coffee-50 dark:bg-gray-900 flex flex-col transition-colors">
      <AppHeader
        onSearchCity={handleCitySearch}
        onShowFavorites={() => setShowFavorites(!showFavorites)}
        showingFavorites={showFavorites}
        onResetLocation={() => {
          setLocationSet(false);
          setShops([]);
          setCenter(null);
          setError(null);
          setShowFavorites(false);
        }}
        dark={dark}
        onToggleDark={toggleDark}
        onShowInstall={() => setShowInstall(true)}
      />

      {showInstall && <InstallGuide onClose={() => setShowInstall(false)} />}

      {showFavorites ? (
        <Favorites
          favorites={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          getNote={getNote}
          onSaveNote={setNote}
        />
      ) : (
        <Home
          shops={shops}
          center={center}
          isSearching={isSearching}
          error={error}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSearchArea={(lat, lng) => handleNearbySearch(lat, lng)}
          onExpandSearch={handleExpandSearch}
          getNote={getNote}
          onSaveNote={setNote}
        />
      )}
    </div>
  );
}

export default App;
