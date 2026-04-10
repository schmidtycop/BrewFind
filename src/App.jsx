import { useState } from 'react';
import AppHeader from './components/AppHeader';
import LocationPrompt from './components/LocationPrompt';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { useFavorites } from './hooks/useFavorites';
import { searchNearbyCoffeeShops, searchCoffeeShopsByCity } from './api/places';

function App() {
  const [locationSet, setLocationSet] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [shops, setShops] = useState([]);
  const [center, setCenter] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  async function handleNearbySearch(lat, lng) {
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchNearbyCoffeeShops(lat, lng);
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

  if (!locationSet) {
    return (
      <LocationPrompt
        onLocation={handleLocation}
        onSearchCity={handleCitySearchFromPrompt}
      />
    );
  }

  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col">
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
      />

      {showFavorites ? (
        <Favorites
          favorites={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <Home
          shops={shops}
          center={center}
          isSearching={isSearching}
          error={error}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSearchArea={handleNearbySearch}
        />
      )}
    </div>
  );
}

export default App;
