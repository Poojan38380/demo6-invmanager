"use server";

import prisma from "@/prisma";

export type ProductReportDataType = {
  id: string;
  name: string;
  stock: number;
  SKU: string | null;
  unit: string | null;
  updatedAt: Date;
  bufferStock: number | null;
  createdAt: Date;
  creatorId: string;
  hasVariants: boolean;
  isArchived: boolean;
  qtyInBox: number | null;
  shortDescription: string | null;

  productVariants: {
    id: string;
    createdAt: Date;
    variantName: string;
    variantStock: number;
  }[];

  vendor: {
    companyName: string;
  } | null;
  vendorId: string | null;

  category: {
    name: string;
  } | null;
  categoryId: string | null;

  transactions: {
    id: string;
    action: "CREATED" | "DELETED" | "INCREASED" | "DECREASED" | "RETURNED";
    createdAt: Date;
    note: string | null;
    stockAfter: number;
    stockBefore: number;
    stockChange: number;
    user: {
      username: string;
    };
    userId: string;
    vendor: {
      companyName: string;
    } | null;
    customer: {
      companyName: string;
    } | null;
    vendorId: string | null;
    customerId: string | null;
  }[];

  creator: {
    email: string | null;
    username: string;
    profilePic: string;
  };
};

export type ReportTransactionsType = {
  id: string;
  action: "CREATED" | "DELETED" | "INCREASED" | "DECREASED" | "RETURNED";
  createdAt: Date;
  note: string | null;
  stockAfter: number;
  stockBefore: number;
  stockChange: number;
  user: {
    username: string;
  };
  userId: string;
  vendor: {
    companyName: string;
  } | null;
  customer: {
    companyName: string;
  } | null;
  vendorId: string | null;
  customerId: string | null;
}[];

export async function GetProductReportData(
  productId: string
): Promise<ProductReportDataType | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      stock: true,
      SKU: true,
      unit: true,
      updatedAt: true,
      bufferStock: true,
      createdAt: true,
      creatorId: true,
      hasVariants: true,
      isArchived: true,
      qtyInBox: true,
      shortDescription: true,

      productVariants: {
        select: {
          id: true,
          createdAt: true,
          variantName: true,
          variantStock: true,
        },
      },

      vendor: { select: { companyName: true } },
      vendorId: true,
      category: { select: { name: true } },
      categoryId: true,

      transactions: {
        select: {
          id: true,
          action: true,
          createdAt: true,
          note: true,
          stockAfter: true,
          stockBefore: true,
          stockChange: true,
          user: { select: { username: true } },
          userId: true,
          vendor: { select: { companyName: true } },
          customer: { select: { companyName: true } },
          vendorId: true,
          customerId: true,
        },
      },
      creator: { select: { email: true, username: true, profilePic: true } },
    },
  });

  if (!product) return null;

  return product;
}
