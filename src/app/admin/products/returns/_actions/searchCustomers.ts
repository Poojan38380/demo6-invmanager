"use server";

import prisma from "@/prisma";
import { Customer } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function searchCustomers(query: string): Promise<Customer[]> {
    if (!query || query.trim() === "") {
        return [];
    }

    try {
        const customers = await prisma.customer.findMany({
            where: {
                companyName: {
                    contains: query,
                    mode: "insensitive",
                },
                isArchived: false
            },
            select: {
                id: true,
                companyName: true,
                contactName: true,
                contactNumber: true,
                email: true,
                address: true,
                createdAt: true,
                isArchived: true,
                _count: {
                    select: {
                        transactions: true,
                        Return: true
                    }
                }
            },
            take: 10,
            orderBy: { companyName: "asc" },
        });

        return customers;
    } catch (error) {
        console.error("Error searching customers:", error);
        return [];
    }
}

// Cached version of searchCustomers
export const getCachedCustomerSearch = cache(
    searchCustomers,
    ["customer-search"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["customers", "transactions", "returns"]
    }
); 