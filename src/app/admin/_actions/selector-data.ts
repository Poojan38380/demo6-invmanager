"use server";
import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import { CategoryWithCounts } from "@/types/dataTypes";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { Customer, MeasurementUnit, Vendor, Warehouse } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function getCategories(): Promise<CategoryWithCounts[]> {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
  return categories;
}

export const getCachedCategories = cache(
  async () => getCategories(),
  ["get-categories"]
);
async function getSuppliers(): Promise<Vendor[]> {
  const suppliers = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { transactions: true } } },
  });
  return suppliers;
}

export const getCachedSuppliers = cache(
  async () => getSuppliers(),
  ["get-suppliers"]
);
async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return customers;
}

export const getCachedCustomers = cache(
  async () => getCustomers(),
  ["get-customers"]
);
async function getWarehouses(): Promise<Warehouse[]> {
  const warehouses = await prisma.warehouse.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
  return warehouses;
}
export const getCachedWarehouses = cache(
  async () => getWarehouses(),
  ["get-warehouses"]
);

async function getUnits(): Promise<MeasurementUnit[]> {
  const units = await prisma.measurementUnit.findMany();
  return units;
}

export const getCachedUnits = cache(async () => getUnits(), ["get-units"]);

export async function createUnit(unitName: string) {
  if (!unitName) {
    throw new Error("Unit name is required");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const existingUnit = await prisma.measurementUnit.findUnique({
      where: { name: unitName },
    });
    if (existingUnit)
      throw new Error("Unit with the same name already exists.");
    const newUnit = await prisma.measurementUnit.create({
      data: { name: unitName },
    });

    const notificationMessage = `A new unit *${unitName}* has been created by *${session.user.username}*.`;

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: ["/admin/settings/units", "/admin/products/new"],
        tagsToRevalidate: ["get-units"],
      }),
    ]);

    return { success: true, unitId: newUnit.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createUnit server action: ", error.stack);
    }
    return { success: false, error: `Failed to create new unit: ${error}` };
  }
}
