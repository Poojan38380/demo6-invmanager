"use server";
"use cache";
import prisma from "@/prisma";
import { Transaction } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

// Define a type for the filter options
type TransactionFilter = {
  productId?: string;
  userId?: string;
  vendorId?: string;
  customerId?: string;
};

async function getTransactions(
  filter: TransactionFilter = {}
): Promise<Transaction[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
    });
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}

// Cached version of getTransactions
export const getCachedTransactions = cache(getTransactions, [
  "get-all-transactions",
]);

// Helper functions for specific queries
export const getAllTransactions = () => getCachedTransactions({});
export const getTransactionsByProductId = (productId: string) =>
  getCachedTransactions({ productId });
export const getTransactionsByUserId = (userId: string) =>
  getCachedTransactions({ userId });
export const getTransactionsByVendorId = (vendorId: string) =>
  getCachedTransactions({ vendorId });
export const getTransactionsByCustomerId = (customerId: string) =>
  getCachedTransactions({ customerId });
