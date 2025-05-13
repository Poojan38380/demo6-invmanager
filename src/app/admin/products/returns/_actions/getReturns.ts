"use server";

import prisma from "@/prisma";
import { unstable_cache as cache } from "next/cache";

async function getReturns() {
    try {
        const returns = await prisma.return.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                createdAt: true,
                returnQty: true,
                returnReason: true,
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
                        variantName: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        companyName: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            take: 1000, // Limit to prevent excessive data fetching
        });
        return returns;
    } catch (error) {
        console.error("Error fetching returns:", error);
        return [];
    }
}

// Cached version of getReturns
export const getCachedReturns = cache(
    getReturns,
    ["get-all-returns"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["returns", "products", "customers", "users"]
    }
); 