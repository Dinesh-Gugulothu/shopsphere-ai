"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/services/product-service";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

import ProductSearch from "./product-search";
import ProductCard from "./product-card";

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [minDiscount, setMinDiscount] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  // Reset page when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    sortOrder,
    minPrice,
    maxPrice,
    minRating,
    stockFilter,
    minDiscount,
    productsPerPage,
  ]);

  // Clear all filters
  function handleClearAllFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOrder("default");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("all");
    setStockFilter("all");
    setMinDiscount("all");
    setCurrentPage(1);
  }

  // Product categories
  const categories = [
    "all",
    "beauty",
    "fragrances",
    "furniture",
    "groceries",
    "smartphones",
    "laptops",
    "mens-shirts",
    "mens-shoes",
    "womens-dresses",
    "womens-shoes",
    "tops",
    "sunglasses",
  ];

  // Fetch products
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Cart store
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  // Wishlist store
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore(
    (state) => state.addToWishlist
  );
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  // Toggle wishlist
  function handleToggleWishlist(product) {
    const alreadyWishlisted = wishlist.some(
      (item) => item.id === product.id
    );

    if (alreadyWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  // Remove individual filters
  function removeFilter(filter) {
    switch (filter) {
      case "search":
        setSearchTerm("");
        break;
      case "category":
        setSelectedCategory("all");
        break;
      case "minPrice":
        setMinPrice("");
        break;
      case "maxPrice":
        setMaxPrice("");
        break;
      case "rating":
        setMinRating("all");
        break;
      case "stock":
        setStockFilter("all");
        break;
      case "discount":
        setMinDiscount("all");
        break;
      default:
        break;
    }
    setCurrentPage(1);
  }

  // Apply all filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    const matchesMinPrice =
      minPrice === "" || product.price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || product.price <= Number(maxPrice);

    const matchesRating =
      minRating === "all" ||
      product.rating >= Number(minRating);

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in-stock" && product.stock > 0) ||
      (stockFilter === "out-of-stock" && product.stock <= 0);

    const matchesDiscount =
      minDiscount === "all" ||
      product.discountPercentage >= Number(minDiscount);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesRating &&
      matchesStock &&
      matchesDiscount
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-to-high") {
      return a.price - b.price;
    }

    if (sortOrder === "high-to-low") {
      return b.price - a.price;
    }

    if (sortOrder === "rating-high-to-low") {
      return b.rating - a.rating;
    }

    if (sortOrder === "newest") {
      const dateA = new Date(a.meta?.createdAt || 0).getTime();
      const dateB = new Date(b.meta?.createdAt || 0).getTime();

      return dateB - dateA || b.id - a.id;
    }

    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(
    sortedProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const startProduct =
    sortedProducts.length === 0 ? 0 : startIndex + 1;

  const endProduct = Math.min(
    startIndex + productsPerPage,
    sortedProducts.length
  );

  // Format category name
  function formatCategory(category) {
    return category
      .replace("mens-", "Men's ")
      .replace("womens-", "Women's ")
      .replace("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="space-y-6 p-4">

      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">ShopSphere AI</h1>

        <div className="flex gap-4 text-sm font-semibold">
          <p>Cart: {cart.length}</p>
          <p>Wishlist: {wishlist.length}</p>
        </div>
      </div>

      {/* Search and sorting */}
      <div className="flex flex-wrap items-center gap-4">
        <ProductSearch onSearch={setSearchTerm} />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3"
        >
          <option value="default">Recommended</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="rating-high-to-low">
            Rating: Highest First
          </option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Clear all filters */}
      <div className="flex justify-end">
        <button
          onClick={handleClearAllFilters}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Clear All Filters
        </button>
      </div>

      {/* Active filter chips */}
      {(searchTerm ||
        selectedCategory !== "all" ||
        minPrice !== "" ||
        maxPrice !== "" ||
        minRating !== "all" ||
        stockFilter !== "all" ||
        minDiscount !== "all") && (
        <div className="rounded-xl border bg-gray-50 p-4">
          <h2 className="mb-3 font-semibold text-gray-800">
            Active Filters
          </h2>

          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <button
                onClick={() => removeFilter("search")}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800 hover:bg-blue-200"
              >
                Search: {searchTerm} ×
              </button>
            )}

            {selectedCategory !== "all" && (
              <button
                onClick={() => removeFilter("category")}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800 hover:bg-blue-200"
              >
                Category: {formatCategory(selectedCategory)} ×
              </button>
            )}

            {minPrice !== "" && (
              <button
                onClick={() => removeFilter("minPrice")}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800 hover:bg-blue-200"
              >
                Min Price: ${minPrice} ×
              </button>
            )}

            {maxPrice !== "" && (
              <button
                onClick={() => removeFilter("maxPrice")}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800 hover:bg-blue-200"
              >
                Max Price: ${maxPrice} ×
              </button>
            )}

            {minRating !== "all" && (
              <button
                onClick={() => removeFilter("rating")}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800 hover:bg-blue-200"
              >
                Rating: {minRating}+ Stars ×
              </button>
            )}

            {stockFilter !== "all" && (
              <button
                onClick={() => removeFilter("stock")}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800 hover:bg-blue-200"
              >
                {stockFilter === "in-stock" ? "In Stock" : "Out of Stock"} ×
              </button>
            )}

            {minDiscount !== "all" && (
              <button
                onClick={() => removeFilter("discount")}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800 hover:bg-blue-200"
              >
                Discount: {minDiscount}%+ ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Price filter */}
      <div className="rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">Filter by Price</h2>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min="0"
            placeholder="Minimum price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-40 rounded-lg border px-3 py-2"
          />

          <span>to</span>

          <input
            type="number"
            min="0"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-40 rounded-lg border px-3 py-2"
          />

          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
            className="rounded-lg border px-4 py-2"
          >
            Clear Price
          </button>
        </div>
      </div>

      {/* Rating filter */}
      <div className="rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">
          Minimum Customer Rating
        </h2>

        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full max-w-xs rounded-lg border px-4 py-3"
        >
          <option value="all">All Ratings</option>
          <option value="3">3 Stars & Above</option>
          <option value="4">4 Stars & Above</option>
          <option value="4.5">4.5 Stars & Above</option>
        </select>
      </div>

      {/* Stock filter */}
      <div className="rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">Stock Availability</h2>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="w-full max-w-xs rounded-lg border px-4 py-3"
        >
          <option value="all">All Products</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Discount filter */}
      <div className="rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">Minimum Discount</h2>

        <select
          value={minDiscount}
          onChange={(e) => setMinDiscount(e.target.value)}
          className="w-full max-w-xs rounded-lg border px-4 py-3"
        >
          <option value="all">All Discounts</option>
          <option value="5">5% and Above</option>
          <option value="10">10% and Above</option>
          <option value="15">15% and Above</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Categories</h2>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                selectedCategory === category
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {formatCategory(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Results count and page size */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Showing {startProduct}–{endProduct} of{" "}
          {sortedProducts.length} products
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm">
            Products per page:
          </label>

          <select
            id="page-size"
            value={productsPerPage}
            onChange={(e) =>
              setProductsPerPage(Number(e.target.value))
            }
            className="rounded-lg border px-3 py-2"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <p className="py-10 text-center">Loading products...</p>
      )}

      {isError && (
        <p className="py-10 text-center text-red-500">
          Failed to load products. Please try again.
        </p>
      )}

      {/* Product cards */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.some(
                    (item) => item.id === product.id
                  )}
                />
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 py-6">
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg border px-4 py-2 ${
                    currentPage === page
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}