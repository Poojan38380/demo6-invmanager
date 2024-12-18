import prisma from "@/prisma";
import { Product } from "@prisma/client";

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

export async function getProductsforTable(): Promise<ProductWithOneImage[]> {
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
