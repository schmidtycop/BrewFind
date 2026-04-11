import { useState, useCallback } from 'react';

const STORAGE_KEY = 'brewfind-visited';

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

export function useVisited() {
  const [visited, setVisited] = useState(load);

  const toggleVisited = useCallback((shopId) => {
    setVisited((prev) => {
      const next = { ...prev };
      if (next[shopId]) {
        delete next[shopId];
      } else {
        next[shopId] = new Date().toISOString();
      }
      save(next);
      return next;
    });
  }, []);

  const isVisited = useCallback((shopId) => !!visited[shopId], [visited]);

  const visitedDate = useCallback(
    (shopId) => visited[shopId] || null,
    [visited]
  );

  return { visited, toggleVisited, isVisited, visitedDate };
}
