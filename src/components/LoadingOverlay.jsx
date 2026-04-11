export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-coffee-900/60 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl">
        {/* Animated coffee cup filling */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          {/* Cup */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Steam wisps */}
            <path d="M30 28 Q30 15 38 12" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-steam1" />
            <path d="M50 25 Q50 10 58 8" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-steam2" />
            <path d="M68 28 Q68 15 76 12" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-steam3" />

            {/* Cup body */}
            <rect x="18" y="35" width="64" height="50" rx="8" fill="#f5e6d0" />

            {/* Coffee liquid with fill animation */}
            <clipPath id="cup-clip">
              <rect x="22" y="39" width="56" height="42" rx="5" />
            </clipPath>
            <g clipPath="url(#cup-clip)">
              <rect x="22" y="39" width="56" height="42" fill="#5c3a1b" className="animate-fill" />
            </g>

            {/* Cup rim */}
            <rect x="14" y="33" width="72" height="6" rx="3" fill="#e8c9a0" />

            {/* Handle */}
            <path d="M82 48 Q96 48 96 62 Q96 76 82 76" stroke="#f5e6d0" strokeWidth="6" fill="none" strokeLinecap="round" />

            {/* Saucer */}
            <ellipse cx="50" cy="90" rx="40" ry="6" fill="#e8c9a0" />
          </svg>
        </div>

        <p className="text-coffee-700 dark:text-coffee-200 font-semibold text-lg">Brewing results...</p>
        <div className="flex justify-center gap-1 mt-2">
          <span className="w-2 h-2 bg-coffee-400 rounded-full animate-dot1"></span>
          <span className="w-2 h-2 bg-coffee-400 rounded-full animate-dot2"></span>
          <span className="w-2 h-2 bg-coffee-400 rounded-full animate-dot3"></span>
        </div>
      </div>
    </div>
  );
}
