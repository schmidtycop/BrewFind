export default function CoffeeShopCard({ shop, isFavorite, onToggleFavorite, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick?.(shop.id)}
      className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
        isSelected ? 'border-amber-400 shadow-md' : 'border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-coffee-800 truncate">{shop.name}</h3>
          {shop.address && (
            <p className="text-sm text-coffee-500 truncate mt-0.5">{shop.address}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(shop);
          }}
          className="text-xl hover:scale-125 transition-transform flex-shrink-0"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex items-center flex-wrap gap-3 mt-3 text-sm">
        {shop.rating && (
          <span className="flex items-center gap-1 font-medium text-coffee-700">
            ⭐ {shop.rating}
            <span className="text-coffee-400 font-normal">({shop.reviewCount})</span>
          </span>
        )}
        {shop.priceLevel && (
          <span className="text-coffee-500 font-medium">{shop.priceLevel}</span>
        )}
        {shop.isOpen !== null && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              shop.isOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {shop.isOpen ? 'Open' : 'Closed'}
          </span>
        )}
        {shop.openingHours && (
          <span className="text-coffee-400 text-xs truncate max-w-[200px]" title={shop.openingHours}>
            🕐 {shop.openingHours}
          </span>
        )}
      </div>

      {shop.website && (
        <a
          href={shop.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-block mt-2 text-xs text-amber-600 hover:text-amber-500 underline truncate max-w-full"
        >
          Visit website
        </a>
      )}
    </div>
  );
}
