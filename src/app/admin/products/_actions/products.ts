"use server";

import prisma from "@/prisma";
import { Product } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

export type ProductWithOneImage = Product & {
  productImages: {
    url: string;
  }[];
  vendor: {
    companyName: string;
  } | null;
  category: {
    name: string;
  } | null;
};

async function getProductsforTable(): Promise<ProductWithOneImage[]> {
  // Fetch data from your API here.
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      vendor: {
        select: { companyName: true },
      },
      category: { select: { name: true } },
      productImages: {
        take: 1,
        select: { url: true },
      },
    },
  });
  return products;
}

export const getCachedProductsforTable = cache(
  async () => getProductsforTable(),
  ["get-products-for-table"]
);

export async function addProduct(prevState: unknown, formData: FormData) {}
