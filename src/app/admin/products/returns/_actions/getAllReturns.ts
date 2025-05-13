"use server";
import prisma from "@/prisma";
import { unstable_cache as cache } from "next/cache";

async function getAllReturns() {
    try {
        const returns = await prisma.return.findMany({
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
            orderBy: {
                createdAt: "desc",
            },
        });
        return returns;
    } catch (error) {
        console.error("Error fetching all returns:", error);
        return [];
    }
}

export const getCachedAllReturns = cache(
    getAllReturns,
    ["get-all-returns"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["returns", "products", "customers", "users"]
    }
);

async function getReturnById(id: string) {
    if (!id) return null;

    try {
        const returnEntry = await prisma.return.findUnique({
            where: { id },
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
                        stock: true,
                    },
                },
                productVariant: {
                    select: {
                        id: true,
                        variantName: true,
                        variantStock: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        companyName: true,
                        contactName: true,
                        contactNumber: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        return returnEntry;
    } catch (error) {
        console.error("Error fetching return by ID:", error);
        return null;
    }
}

export const getCachedReturnById = cache(
    getReturnById,
    ["get-return-by-id"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["returns", "products", "customers", "users"]
    }
);

async function getReturnsByProductId(productId: string) {
    if (!productId) return [];

    try {
        const returns = await prisma.return.findMany({
            where: { productId },
            select: {
                id: true,
                createdAt: true,
                returnQty: true,
                returnReason: true,
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
            orderBy: {
                createdAt: "desc",
            },
        });
        return returns;
    } catch (error) {
        console.error("Error fetching returns by product ID:", error);
        return [];
    }
}

export const getCachedReturnsByProductId = cache(
    getReturnsByProductId,
    ["get-returns-by-product"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["returns", "products", "customers", "users"]
    }
);

async function getReturnsByCustomerId(customerId: string) {
    if (!customerId) return [];

    try {
        const returns = await prisma.return.findMany({
            where: { customerId },
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
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return returns;
    } catch (error) {
        console.error("Error fetching returns by customer ID:", error);
        return [];
    }
}

export const getCachedReturnsByCustomerId = cache(
    getReturnsByCustomerId,
    ["get-returns-by-customer"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["returns", "products", "customers", "users"]
    }
);

