import CoffeeShopCard from './CoffeeShopCard';

export default function CoffeeShopList({ shops, isFavorite, onToggleFavorite, selectedShopId, onShopClick }) {
  if (shops.length === 0) {
    return (
      <div className="text-center py-12 text-coffee-400">
        <div className="text-4xl mb-3">&#9749;</div>
        <p>No coffee shops found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto pr-1">
      {shops.map((shop) => (
        <CoffeeShopCard
          key={shop.id}
          shop={shop}
          isFavorite={isFavorite(shop.id)}
          onToggleFavorite={onToggleFavorite}
          isSelected={selectedShopId === shop.id}
          onClick={onShopClick}
        />
      ))}
    </div>
  );
}
