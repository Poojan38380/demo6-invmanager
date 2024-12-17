import prisma from "@/prisma";
import { Product } from "@prisma/client";
import React from "react";
import ToggleTable from "./toggle-table";

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

async function getData(): Promise<ProductWithOneImage[]> {
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

export default async function ProductsPage() {
  const products = await getData();

  return (
    <>
      <ToggleTable products={products} />
    </>
  );
}
