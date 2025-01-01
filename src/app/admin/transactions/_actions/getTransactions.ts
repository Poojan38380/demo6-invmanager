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
};

async function getTransactions(
  filter: TransactionFilter = {}
): Promise<TransactionForTable[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            name: true,
            unit: true,
            costPrice: true,
            sellingPrice: true,
          },
        },
        productVariant: { select: { variantName: true } },
        user: { select: { username: true } },
        customer: { select: { companyName: true } },
        vendor: { select: { companyName: true } },
      },
    });
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}

// Cached version of getTransactions
export const cacheTransactionsFn = cache(getTransactions, [
  "get-all-transactions",
]);

// Helper functions for specific queries
export const getAllCachedTransactions = async () => cacheTransactionsFn({});
export const getCachedTransactionsByProductId = async (productId: string) =>
  cacheTransactionsFn({ productId });
export const getCachedTransactionsByVariantId = async (
  productVariantId: string
) => cacheTransactionsFn({ productVariantId });
export const getCachedTransactionsByUserId = async (userId: string) =>
  cacheTransactionsFn({ userId });
export const getCachedTransactionsByVendorId = async (vendorId: string) =>
  cacheTransactionsFn({ vendorId });
export const getCachedTransactionsByCustomerId = async (customerId: string) =>
  cacheTransactionsFn({ customerId });
