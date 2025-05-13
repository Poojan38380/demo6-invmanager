"use server";
import prisma from "@/prisma";
import { unstable_cache as cache } from "next/cache";

async function getSuppliers() {
    return await prisma.vendor.findMany({
        where: {
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
                    products: true,
                    transactions: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

export const getCachedSuppliers = cache(
    getSuppliers,
    ["get-all-suppliers"],
    {
        revalidate: 60 * 5, // Revalidate every 5 minutes
        tags: ["suppliers", "products", "transactions"]
    }
); 