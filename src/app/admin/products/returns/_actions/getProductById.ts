"use server";

import prisma from "@/prisma";
import { ProductWithOneImage } from "../../_actions/products";

export async function getProductById(id: string): Promise<ProductWithOneImage | null> {
    if (!id) {
        return null;
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                vendor: {
                    select: { companyName: true },
                },
                category: { select: { name: true } },
                productImages: {
                    take: 1,
                    select: { url: true },
                },
                productVariants: true,
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