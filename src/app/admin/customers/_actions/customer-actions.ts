"use server";
import prisma from "@/prisma";
import { unstable_cache as cache } from "next/cache";

async function getCustomers() {
    return await prisma.customer.findMany({
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
                    transactions: true,
                    Return: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

export const getCachedCustomers = cache(
    getCustomers,
    ["get-all-customers"],
    {
        revalidate: 60 * 5, // Revalidate every 5 minutes
        tags: ["customers", "transactions", "returns"]
    }
); 