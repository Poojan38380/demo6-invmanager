"use client";

import React from "react";
import { motion } from "framer-motion";
import ProductDisplayCard from "./products-display-card";
import { ProductWithImages } from "@/types/dataTypes";

interface ProductGridProps {
  products: ProductWithImages[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-lg border border-dashed">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
          <p className="text-muted-foreground">
            We couldnt find any products at the moment. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="transform transition-all duration-300 hover:scale-[1.02]"
        >
          <ProductDisplayCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
