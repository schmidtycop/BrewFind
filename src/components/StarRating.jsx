export default function StarRating({ rating, onRate, size = 'text-lg' }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={(e) => {
            e.stopPropagation();
            onRate(rating === star ? 0 : star);
          }}
          className={`${size} transition-transform hover:scale-125 ${
            star <= rating ? '' : 'opacity-30'
          }`}
          title={rating === star ? 'Remove rating' : `Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
