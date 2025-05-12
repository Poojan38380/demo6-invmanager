"use server";

import prisma from "@/prisma";
import { Customer } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function getCustomerById(id: string): Promise<Customer | null> {
    if (!id) {
        return null;
    }

    try {
        const customer = await prisma.customer.findUnique({
            where: { id },
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
            }
        });

        return customer;
    } catch (error) {
        console.error("Error getting customer by ID:", error);
        return null;
    }
}

export const getCachedCustomerById = cache(
    getCustomerById,
    ["get-customer-by-id"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["customers", "transactions", "returns"]
    }
); 