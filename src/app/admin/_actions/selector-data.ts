"use server";
import prisma from "@/prisma";
import {
  Category,
  Customer,
  MeasurementUnit,
  Vendor,
  Warehouse,
} from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
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
