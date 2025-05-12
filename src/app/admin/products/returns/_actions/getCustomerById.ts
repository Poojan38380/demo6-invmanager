"use server";

import prisma from "@/prisma";
import { Customer } from "@prisma/client";

export async function getCustomerById(id: string): Promise<Customer | null> {
    if (!id) {
        return null;
    }

    try {
        const customer = await prisma.customer.findUnique({
            where: { id },
        });

        return customer;
    } catch (error) {
        console.error("Error getting customer by ID:", error);
        return null;
    }
} 