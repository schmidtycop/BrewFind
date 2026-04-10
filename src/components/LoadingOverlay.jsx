export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-coffee-900/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div className="text-5xl mb-4 animate-bounce">&#9749;</div>
        <p className="text-coffee-700 font-semibold text-lg">Finding coffee shops...</p>
        <p className="text-coffee-400 text-sm mt-1">Brewing up results near you</p>
      </div>
    </div>
  );
}
