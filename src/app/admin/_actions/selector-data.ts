import prisma from "@/prisma";
import { Category, Customer, Vendor, Warehouse } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return categories;
}

export const getCachedCategories = cache(
  () => getCategories(),
  ["get-categories"]
);
async function getSuppliers(): Promise<Vendor[]> {
  const suppliers = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
  });
  return suppliers;
}

export const getCachedSuppliers = cache(
  () => getSuppliers(),
  ["get-suppliers"]
);
async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return customers;
}

export const getCachedCustomers = cache(
  () => getCustomers(),
  ["get-customers"]
);
async function getWarehouses(): Promise<Warehouse[]> {
  const warehouses = await prisma.warehouse.findMany({
    orderBy: { createdAt: "desc" },
  });
  return warehouses;
}

export const getCachedWarehouses = cache(
  () => getWarehouses(),
  ["get-warehouses"]
);
