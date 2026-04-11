import { useState, useCallback } from 'react';

const STORAGE_KEY = 'brewfind-ratings';

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useRatings() {
  const [ratings, setRatings] = useState(load);

  const setRating = useCallback((shopId, stars) => {
    setRatings((prev) => {
      const next = { ...prev };
      if (stars === 0) {
        delete next[shopId];
      } else {
        next[shopId] = stars;
      }
      save(next);
      return next;
    });
  }, []);

  const getRating = useCallback((shopId) => ratings[shopId] || 0, [ratings]);

  return { ratings, setRating, getRating };
}
