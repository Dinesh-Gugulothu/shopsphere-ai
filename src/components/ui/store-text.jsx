"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export default function StoreTest() {
  // Get cart data and cart action
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  // Get wishlist data and wishlist action
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore(
    (state) => state.addToWishlist
  );

  // Sample product
  const product = {
    id: 1,
    title: "Test Smartphone",
    price: 15000,
  };

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-bold">
        Zustand Store Test
      </h2>

      <p>
        {product.title} - ₹{product.price}
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => addToCart(product)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Add to Cart
        </Button>

        <Button
  onClick={() => addToWishlist(product)}
  className="bg-purple-600 text-white hover:bg-purple-700"
>
  Add to Wishlist
</Button>
      </div>

      <p>
        Cart items: {cart.length}
      </p>

      <p>
        Wishlist items: {wishlist.length}
      </p>
    </div>
  );
}