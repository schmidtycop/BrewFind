import { useState } from 'react';

const STORAGE_KEY = 'brewfind-onboarded';

export function useOnboarding() {
  const [seen, setSeen] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  function markSeen() {
    localStorage.setItem(STORAGE_KEY, 'true');
    setSeen(true);
  }

  return { needsOnboarding: !seen, markSeen };
}
