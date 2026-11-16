"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/services/product-service";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import ProductSearch from "./product-search";

export default function ProductList() {
  // Search, category and sorting states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

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

  // Fetch products from API
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Zustand cart store
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  // Zustand wishlist store
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore(
    (state) => state.addToWishlist
  );

  // Step 1: Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Step 2: Sort the filtered products by price
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-to-high") {
      return a.price - b.price;
    }

    if (sortOrder === "high-to-low") {
      return b.price - a.price;
    }

    return 0;
  });

  // Loading state
  if (isLoading) {
    return (
      <p className="text-center mt-10">
        Loading products...
      </p>
    );
  }

  // Error state
  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600">
        Failed to load products.
      </p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">

      {/* Header and counts */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold">
          Explore Products
        </h2>

        <div className="flex gap-5 font-semibold">
          <p>🛒 Cart: {cart.length}</p>
          <p>❤️ Wishlist: {wishlist.length}</p>
        </div>
      </div>

      {/* Search and sorting */}
      <div className="mb-8 space-y-4">
        <ProductSearch onSearch={setSearchTerm} />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-lg px-4 py-3 bg-white"
        >
          <option value="default">Recommended</option>
          <option value="low-to-high">
            Price: Low to High
          </option>
          <option value="high-to-low">
            Price: High to Low
          </option>
        </select>

        {/* Category buttons */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }
            >
              {category
                .replace("mens-", "Men's ")
                .replace("womens-", "Women's ")
                .replace("-", " ")
                .replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
            </Button>
          ))}
        </div>
      </div>

      {/* Product count */}
      <p className="text-gray-500 mb-5">
        Showing {sortedProducts.length} products
      </p>

      {/* Product grid */}
      {sortedProducts.length === 0 ? (
        <p className="text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-lg transition"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-contain mb-4"
              />

              <h3 className="font-semibold text-lg line-clamp-1">
                {product.title}
              </h3>

              <p className="text-gray-500 text-sm capitalize mt-1">
                {product.category}
              </p>

              <p className="text-xl font-bold mt-3">
                ₹{product.price}
              </p>

              <p className="text-yellow-600 text-sm mt-1">
                ⭐ {product.rating}
              </p>

              <div className="flex flex-col gap-2 mt-4">
                <Button
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add to Cart
                </Button>

                <Button
                  onClick={() => addToWishlist(product)}
                  className="w-full bg-purple-600 text-white hover:bg-purple-700"
                >
                  Add to Wishlist
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}