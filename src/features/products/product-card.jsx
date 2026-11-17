export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Product image */}
      <div className="flex h-56 items-center justify-center overflow-hidden bg-gray-50 p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-4">

        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          {product.category}
        </p>

        <h2 className="line-clamp-2 min-h-12 font-semibold text-gray-900">
          {product.title}
        </h2>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">
            ${product.price}
          </p>

          <p className="text-sm text-gray-600">
            ⭐ {product.rating}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex gap-2 pt-5">

          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add to Cart
          </button>

          <button
            onClick={() => onToggleWishlist(product)}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            aria-pressed={isWishlisted}
            className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
              isWishlisted
                ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                : "border-gray-300 bg-white text-gray-700 hover:border-red-400 hover:text-red-500"
            }`}
          >
            {isWishlisted ? "♥" : "♡"}
          </button>

        </div>
      </div>
    </div>
  );
}