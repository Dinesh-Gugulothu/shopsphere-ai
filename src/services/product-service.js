const API_URL = "https://dummyjson.com";

export async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products?limit=0`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return data.products;
  } catch (error) {
    console.error("Product API error:", error);
    throw error;
  }
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}