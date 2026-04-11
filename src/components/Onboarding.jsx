import { useState } from 'react';

const slides = [
  {
    icon: '&#9749;',
    title: 'Find Coffee Anywhere',
    desc: 'Search by city, zip code, or use your location to discover coffee shops nearby.',
  },
  {
    icon: '❤️',
    title: 'Save Your Favorites',
    desc: 'Tap the heart to save shops you love. Add personal notes and star ratings to remember what you liked.',
  },
  {
    icon: '🗺️',
    title: 'Explore the Map',
    desc: 'Pan the map to a new area and tap "Search this area" to find shops wherever you go. Get directions with one tap.',
  },
];

export default function Onboarding({ onComplete }) {
  const [current, setCurrent] = useState(0);

  function handleNext() {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  }

  const slide = slides[current];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Slide content */}
        <div className="p-8 text-center">
          <div className="text-6xl mb-5" dangerouslySetInnerHTML={{ __html: slide.icon }} />
          <h3 className="text-xl font-bold text-coffee-800 dark:text-coffee-100 mb-3">{slide.title}</h3>
          <p className="text-coffee-500 dark:text-coffee-300 text-sm leading-relaxed">{slide.desc}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-4">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? 'bg-amber-500' : 'bg-coffee-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex border-t border-coffee-100 dark:border-gray-700">
          <button
            onClick={onComplete}
            className="flex-1 py-4 text-sm text-coffee-400 dark:text-coffee-500 hover:bg-coffee-50 dark:hover:bg-gray-700 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-4 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors border-l border-coffee-100 dark:border-gray-700"
          >
            {current < slides.length - 1 ? 'Next' : "Let's Go!"}
          </button>
        </div>
      </div>
    </div>
  );
}
