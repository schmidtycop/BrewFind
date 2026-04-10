import { useState, useCallback } from 'react';

const STORAGE_KEY = 'brewfind-favorites';

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  const toggleFavorite = useCallback((shop) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === shop.id);
      const next = exists ? prev.filter((f) => f.id !== shop.id) : [...prev, shop];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
