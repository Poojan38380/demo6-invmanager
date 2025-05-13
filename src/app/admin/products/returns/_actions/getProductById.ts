"use server";

import prisma from "@/prisma";
import { ProductWithOneImage } from "../../_actions/products";
import { unstable_cache as cache } from "next/cache";

async function getProductById(id: string): Promise<ProductWithOneImage | null> {
    if (!id) {
        return null;
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                stock: true,
                SKU: true,
                unit: true,
                hasVariants: true,
                createdAt: true,
                updatedAt: true,
                isArchived: true,
                shortDescription: true,
                longDescription: true,
                bufferStock: true,
                qtyInBox: true,
                creatorId: true,
                categoryId: true,
                warehouseId: true,
                vendorId: true,
                vendor: {
                    select: {
                        id: true,
                        companyName: true
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                productImages: {
                    take: 1,
                    select: {
                        id: true,
                        url: true
                    },
                },
                productVariants: {
                    select: {
                        id: true,
                        variantName: true,
                        variantStock: true,
                        createdAt: true,
                        updatedAt: true,
                        productId: true
                    }
                },
                transactions: {
                    where: {
                        action: "DECREASED",
                        createdAt: {
                            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                        },
                    },
                    select: {
                        stockChange: true,
                    },
                },
                _count: {
                    select: {
                        transactions: { where: { action: { not: "CREATED" } } },
                    },
                },
            },
        });

        if (!product) return null;

        const lastMonthSales = product.transactions.reduce(
            (total, transaction) => total + Math.abs(transaction.stockChange),
            0
        );

        return {
            ...product,
            lastMonthSales,
            specialTransactionCount: product._count.transactions,
        };
    } catch (error) {
        console.error("Error getting product by ID:", error);
        return null;
    }
}

export const getCachedProductById = cache(
    getProductById,
    ["get-product-by-id"],
    {
        revalidate: 60 * 2, // Revalidate every 2 minutes
        tags: ["products", "product-images", "product-variants", "transactions"]
    }
); 