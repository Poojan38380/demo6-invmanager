"use server";
import prisma from "@/prisma";

export async function getAllReturns() {
    const returns = await prisma.return.findMany();
    return returns;
}

export async function getReturnById(id: string) {
    const returnEntry = await prisma.return.findUnique({
        where: { id },
    });
    return returnEntry;
}

export async function getReturnsByProductId(productId: string) {
    const returns = await prisma.return.findMany({
        where: { productId },
    });
    return returns;
}

export async function getReturnsByCustomerId(customerId: string) {
    const returns = await prisma.return.findMany({
        where: { customerId },
    });
    return returns;
}

