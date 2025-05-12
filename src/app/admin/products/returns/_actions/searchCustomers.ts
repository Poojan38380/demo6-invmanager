"use server";

import prisma from "@/prisma";
import { Customer } from "@prisma/client";

export async function searchCustomers(query: string): Promise<Customer[]> {
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