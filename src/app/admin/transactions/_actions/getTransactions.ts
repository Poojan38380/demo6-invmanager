"use server";
import prisma from "@/prisma";
import { TransactionForTable } from "@/types/dataTypes";
import { unstable_cache as cache } from "next/cache";

// Define a type for the filter options
type TransactionFilter = {
  productId?: string;
  userId?: string;
  vendorId?: string;
  customerId?: string;
  productVariantId?: string;
  startDate?: Date;
  endDate?: Date;
};

async function getTransactions(
  filter: TransactionFilter = {}
): Promise<TransactionForTable[]> {
  try {
    const { startDate, endDate, ...restFilter } = filter;

    const whereClause = {
      ...restFilter,
      ...(startDate && endDate ? {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      } : {})
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        createdAt: true,
        note: true,
        stockAfter: true,
        stockBefore: true,
        stockChange: true,
        productId: true,
        userId: true,
        customerId: true,
        vendorId: true,
        productVariantId: true,
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
          },
        },
        productVariant: {
          select: {
            id: true,
            variantName: true
          }
        },
        user: {
          select: {
            id: true,
            username: true
          }
        },
        customer: {
          select: {
            id: true,
            companyName: true
          }
        },
        vendor: {
          select: {
            id: true,
            companyName: true
          }
        },
      },
      take: 1000, // Limit to prevent excessive data fetching
    });
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}

// Cache the getTransactions function with different filter combinations
const cacheTransactionsFn = cache(
  getTransactions,
  ["get-transactions"],
  {
    revalidate: 60 * 2, // Revalidate every 2 minutes
    tags: ["transactions", "products", "customers", "suppliers", "users"]
  }
);

export const getCachedTransactionsByUserId = async (userId: string) =>
  cacheTransactionsFn({ userId });

export const getCachedTransactionsByProductId = async (productId: string) =>
  cacheTransactionsFn({ productId });

export const getCachedTransactionsByDateRange = async (startDate: Date, endDate: Date) =>
  cacheTransactionsFn({ startDate, endDate });


export const getAllCachedTransactions = async () =>
  cacheTransactionsFn({});

