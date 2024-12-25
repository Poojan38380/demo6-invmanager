import React from "react";
import { getCachedProductsforDisplay } from "../_actions/products";
import ProductGrid from "./_components/product-grid";

export default async function ProductsDisplayPage() {
  const products = await getCachedProductsforDisplay();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Our Products
          </h1>
          <p className="text-muted-foreground">
            {products.length === 0
              ? "No products available"
              : `Showing ${products.length} amazing products`}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
