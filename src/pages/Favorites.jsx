import CoffeeShopCard from '../components/CoffeeShopCard';

export default function Favorites({ favorites, isFavorite, onToggleFavorite }) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold text-coffee-800 mb-4">
        Your Favorite Coffee Shops
      </h2>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-coffee-400">
          <div className="text-5xl mb-4">💛</div>
          <p className="text-lg">No favorites yet</p>
          <p className="text-sm mt-1">
            Tap the heart on any coffee shop to save it here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((shop) => (
            <CoffeeShopCard
              key={shop.id}
              shop={shop}
              isFavorite={isFavorite(shop.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
