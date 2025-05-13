"use server";

import prisma from "@/prisma";
import { ProductWithImages } from "@/types/dataTypes";
import { unstable_cache as cache } from "next/cache";

async function getProductsforDisplay(): Promise<ProductWithImages[]> {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      stock: true,
      SKU: true,
      unit: true,
      updatedAt: true,
      bufferStock: true,
      hasVariants: true,
      isArchived: true,
      qtyInBox: true,
      shortDescription: true,
      productImages: {
        select: {
          id: true,
          url: true,
          createdAt: true,
          productId: true
        }
      },
      productVariants: {
        select: {
          id: true,
          variantName: true,
          variantStock: true,
          createdAt: true,
          updatedAt: true,
          productId: true
        }
      }
    },
    where: {
      isArchived: false
    }
  });
  return products as ProductWithImages[];
}

export const getCachedProductsforDisplay = cache(
  async () => getProductsforDisplay(),
  ["get-products-for-display"],
  {
    revalidate: 60 * 5, // Revalidate every 5 minutes
    tags: ["products", "product-images", "product-variants"]
  }
);
