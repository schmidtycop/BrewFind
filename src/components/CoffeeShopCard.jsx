import { useState } from 'react';
import StarRating from './StarRating';
import { haptic } from '../utils/haptic';

export default function CoffeeShopCard({
  shop,
  isFavorite,
  onToggleFavorite,
  isSelected,
  onClick,
  distance,
  note,
  onSaveNote,
  isVisited,
  visitedDate,
  onToggleVisited,
  userRating,
  onSetRating,
}) {
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState(note || '');

  function handleDirections(e) {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`;
    window.open(url, '_blank');
  }

  function handleShare(e) {
    e.stopPropagation();
    const text = `${shop.name}${shop.address ? ' - ' + shop.address : ''}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`;
    const shareText = `${text}\n${mapUrl}`;

    if (navigator.share) {
      navigator.share({ title: shop.name, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  }

  function handleSaveNote(e) {
    e.stopPropagation();
    onSaveNote(shop.id, noteText);
    setShowNote(false);
  }

  const visitDate = visitedDate ? new Date(visitedDate).toLocaleDateString() : null;

  return (
    <div
      onClick={() => onClick?.(shop.id)}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
        isSelected ? 'border-amber-400 shadow-md' : 'border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-coffee-800 dark:text-coffee-100 truncate">{shop.name}</h3>
            {isVisited && (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                ✓ Been here
              </span>
            )}
          </div>
          {shop.address && (
            <p className="text-sm text-coffee-500 dark:text-coffee-300 truncate mt-0.5">{shop.address}</p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); haptic(); onToggleFavorite(shop); }}
          className="text-xl hover:scale-125 transition-transform flex-shrink-0"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Star rating */}
      {onSetRating && (
        <div className="mt-2 flex items-center gap-2">
          <StarRating
            rating={userRating || 0}
            onRate={(stars) => { haptic(5); onSetRating(shop.id, stars); }}
            size="text-base"
          />
          {userRating > 0 && (
            <span className="text-xs text-coffee-400 dark:text-coffee-500">Your rating</span>
          )}
        </div>
      )}

      <div className="flex items-center flex-wrap gap-2 mt-3 text-sm">
        {distance !== undefined && (
          <span className="text-coffee-600 dark:text-coffee-300 font-medium">
            📍 {distance < 0.1 ? '< 0.1' : distance.toFixed(1)} mi
          </span>
        )}
        {shop.rating && (
          <span className="flex items-center gap-1 font-medium text-coffee-700 dark:text-coffee-200">
            ⭐ {shop.rating}
            <span className="text-coffee-400 font-normal">({shop.reviewCount})</span>
          </span>
        )}
        {shop.priceLevel && (
          <span className="text-coffee-500 dark:text-coffee-300 font-medium">{shop.priceLevel}</span>
        )}
        {shop.isOpen !== null && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            shop.isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {shop.isOpen ? 'Open' : 'Closed'}
          </span>
        )}
        {shop.openingHours && (
          <span className="text-coffee-400 dark:text-coffee-400 text-xs truncate max-w-[180px]" title={shop.openingHours}>
            🕐 {shop.openingHours}
          </span>
        )}
      </div>

      {/* Visited date */}
      {isVisited && visitDate && (
        <p className="text-xs text-coffee-400 dark:text-coffee-500 mt-1">Visited {visitDate}</p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button
          onClick={handleDirections}
          className="text-xs bg-coffee-100 dark:bg-gray-700 text-coffee-700 dark:text-coffee-200 px-3 py-1.5 rounded-lg hover:bg-coffee-200 dark:hover:bg-gray-600 transition-colors"
        >
          🧭 Directions
        </button>
        <button
          onClick={handleShare}
          className="text-xs bg-coffee-100 dark:bg-gray-700 text-coffee-700 dark:text-coffee-200 px-3 py-1.5 rounded-lg hover:bg-coffee-200 dark:hover:bg-gray-600 transition-colors"
        >
          📤 Share
        </button>
        {onToggleVisited && (
          <button
            onClick={(e) => { e.stopPropagation(); haptic(15); onToggleVisited(shop.id); }}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              isVisited
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'bg-coffee-100 dark:bg-gray-700 text-coffee-700 dark:text-coffee-200 hover:bg-coffee-200 dark:hover:bg-gray-600'
            }`}
          >
            {isVisited ? '✓ Been Here' : '☐ Been Here'}
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setShowNote(!showNote); }}
          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
            note
              ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
              : 'bg-coffee-100 dark:bg-gray-700 text-coffee-700 dark:text-coffee-200 hover:bg-coffee-200 dark:hover:bg-gray-600'
          }`}
        >
          📝 {note ? 'View Note' : 'Add Note'}
        </button>
        {shop.menu && (
          <a
            href={shop.menu}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs bg-coffee-100 dark:bg-gray-700 text-coffee-700 dark:text-coffee-200 px-3 py-1.5 rounded-lg hover:bg-coffee-200 dark:hover:bg-gray-600 transition-colors"
          >
            🍽️ Menu
          </a>
        )}
        {shop.website && (
          <a
            href={shop.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 underline"
          >
            🌐 Website
          </a>
        )}
      </div>

      {/* Note editor */}
      {showNote && (
        <div className="mt-3 border-t border-coffee-100 dark:border-gray-700 pt-3" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your personal note about this shop..."
            className="w-full text-sm border border-coffee-200 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-coffee-900 dark:text-coffee-100 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveNote}
              className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors"
            >
              Save
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowNote(false); }}
              className="text-xs bg-coffee-200 dark:bg-gray-600 text-coffee-700 dark:text-coffee-200 px-3 py-1.5 rounded-lg hover:bg-coffee-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
