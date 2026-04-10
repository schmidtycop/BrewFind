import { useState, useCallback } from 'react';

const STORAGE_KEY = 'brewfind-notes';

function loadNotes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const [notes, setNotes] = useState(loadNotes);

  const setNote = useCallback((shopId, text) => {
    setNotes((prev) => {
      const next = { ...prev };
      if (text.trim()) {
        next[shopId] = { text: text.trim(), updatedAt: new Date().toISOString() };
      } else {
        delete next[shopId];
      }
      saveNotes(next);
      return next;
    });
  }, []);

  const getNote = useCallback((shopId) => notes[shopId]?.text || '', [notes]);

  return { notes, setNote, getNote };
}
