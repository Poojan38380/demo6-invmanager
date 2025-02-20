import prisma from "@/prisma";

export async function getTransactionsForExport() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            name: true,
            unit: true,
            id: true,
          },
        },
        productVariant: { select: { variantName: true } },
        user: { select: { username: true, id: true } },
        customer: { select: { companyName: true, id: true } },
        vendor: { select: { companyName: true, id: true } },
      },
    });
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}
export async function getProductsForExport() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
export async function getCustomersForExport() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, companyName: true },
    });
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to fetch customers");
  }
}
export async function getSuppliersForExport() {
  try {
    const suppliers = await prisma.vendor.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, companyName: true },
    });
    return suppliers;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Failed to fetch suppliers");
  }
}
export async function getusersForExport() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, username: true },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
