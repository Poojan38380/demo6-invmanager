"use server";

import prisma from "@/prisma";
import { ProductWithImages } from "@/types/dataTypes";
import { unstable_cache as cache } from "next/cache";

async function getProductsforDisplay(): Promise<ProductWithImages[]> {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { productImages: true, productVariants: true },
  });
  return products;
}

export const getCachedProductsforDisplay = cache(
  async () => getProductsforDisplay(),
  ["get-products-for-display"],
  { revalidate: 60 * 60 * 12 } // Revalidate every 12 hours
);
