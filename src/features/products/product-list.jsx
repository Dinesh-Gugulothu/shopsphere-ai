"use client";

import { useState } from "react";
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

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-to-high") {
      return a.price - b.price;
    }

    if (sortOrder === "high-to-low") {
      return b.price - a.price;
    }

    return 0;
  });

  return (
    <div className="space-y-6 p-4">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          ShopSphere AI
        </h1>

        <div className="flex gap-4 text-sm font-semibold">
          <p>Cart: {cart.length}</p>
          <p>Wishlist: {wishlist.length}</p>
        </div>
      </div>

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
        </select>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Categories
        </h2>

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
              {category
                .replace("mens-", "Men's ")
                .replace("womens-", "Women's ")
                .replace("-", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Showing {sortedProducts.length} products
      </p>

      {isLoading && (
        <p className="py-10 text-center">
          Loading products...
        </p>
      )}

      {isError && (
        <p className="py-10 text-center text-red-500">
          Failed to load products. Please try again.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
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
      )}
    </div>
  );
}