import ProductList from "@/features/products/product-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-blue-600">
            ShopSphere AI
          </h1>

          <p className="text-gray-600 mt-2">
            Your personalized shopping experience starts here.
          </p>
        </div>
      </header>

      {/* Product Catalogue */}
      <ProductList />
    </main>
  );
}