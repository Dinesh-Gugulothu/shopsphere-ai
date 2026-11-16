"use client";

import { useState } from "react";

export default function ProductSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch(event) {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  }

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
}