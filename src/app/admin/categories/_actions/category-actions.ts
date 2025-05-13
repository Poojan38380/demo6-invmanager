"use server";
import prisma from "@/prisma";
import { unstable_cache as cache } from "next/cache";

async function getCategories() {
    return await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            _count: {
                select: {
                    products: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

export const getCachedCategories = cache(
    getCategories,
    ["get-all-categories"],
    {
        revalidate: 60 * 5, // Revalidate every 5 minutes
        tags: ["categories", "products"]
    }
); 