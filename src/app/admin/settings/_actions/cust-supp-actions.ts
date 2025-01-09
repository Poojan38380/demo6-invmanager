"use server";
import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { Customer, Vendor } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function getSingleCustomer(id: string): Promise<Customer | null> {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });
  return customer;
}

export const getCachedSingleCustomer = cache(
  async (id: string): Promise<Customer | null> => getSingleCustomer(id),
  ["get-single-customer-for-edit"]
);
async function getSingleSupplier(id: string): Promise<Vendor | null> {
  const supplier = await prisma.vendor.findUnique({
    where: { id },
  });
  return supplier;
}

export const getCachedSinglesupplier = cache(
  async (id: string): Promise<Vendor | null> => getSingleSupplier(id),
  ["get-single-supplier-for-edit"]
);

interface addSupplierProps {
  companyName: string;
  contactName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export async function addSupplier(data: addSupplierProps) {
  if (!data.companyName) {
    throw new Error("Supplier company name is required");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const newSupplier = await prisma.vendor.create({
      data,
    });

    const notificationMessage = `A new supplier ${newSupplier.companyName} has been created.`;

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: ["/admin/settings/suppliers"],
        tagsToRevalidate: ["get-suppliers", "get-single-supplier-for-edit"],
      }),
    ]);

    return { success: true, supplierId: newSupplier.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addSupplier server action: ", error.stack);
    }
    return { success: false, error: `Failed to create supplier: ${error}` };
  }
}
interface addCustomerProps {
  companyName: string;
  contactName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export async function addCustomer(data: addCustomerProps) {
  if (!data.companyName) {
    throw new Error("Customer company name is required");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const newCustomer = await prisma.customer.create({
      data,
    });

    const notificationMessage = `A new customer ${newCustomer.companyName} has been created.`;

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: ["/admin/settings/customers"],
        tagsToRevalidate: ["get-customers", "get-single-customer-for-edit"],
      }),
    ]);

    return { success: true, customerId: newCustomer.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addCustomer server action: ", error.stack);
    }
    return { success: false, error: `Failed to create customer: ${error}` };
  }
}

interface editSupplierProps {
  supplierId: string;
  companyName: string;
  contactName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export async function editSupplier(data: editSupplierProps) {
  console.log(data);
  if (!data.companyName) {
    throw new Error("Supplier company name is required");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const supplier = await prisma.vendor.findUnique({
      where: { id: data.supplierId },
      include: { transactions: false },
    });

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    const updatedSupplier = await prisma.vendor.update({
      where: { id: data.supplierId },
      data: {
        companyName: data.companyName,
        contactName: data?.contactName,
        contactNumber: data?.contactNumber,
        email: data?.email,
        address: data?.address,
      },
    });

    await Promise.all([
      cacheRevalidate({
        routesToRevalidate: [
          "/admin/settings/suppliers",
          `/admin/settings/suppliers/${updatedSupplier.id}`,
        ],
        tagsToRevalidate: ["get-suppliers", "get-single-supplier-for-edit"],
      }),
    ]);

    return { success: true, supplierId: updatedSupplier.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in editSupplier server action: ", error.stack);
    }
    return { success: false, error: `Failed to update supplier: ${error}` };
  }
}
interface editCustomerProps {
  customerId: string;
  companyName: string;
  contactName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export async function editCustomer(data: editCustomerProps) {
  if (!data.companyName) {
    throw new Error("Customer company name is required");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId },
      include: { transactions: false },
    });

    if (!customer) {
      throw new Error("Customer not found.");
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: data.customerId },
      data: {
        companyName: data.companyName,
        contactName: data?.contactName,
        contactNumber: data?.contactNumber,
        email: data?.email,
        address: data?.address,
      },
    });

    await Promise.all([
      cacheRevalidate({
        routesToRevalidate: [
          "/admin/settings/customers",
          `/admin/settings/customers/${updatedCustomer.id}`,
        ],
        tagsToRevalidate: ["get-customers", "get-single-customer-for-edit"],
      }),
    ]);

    return { success: true, customerId: updatedCustomer.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in editCustomer server action: ", error.stack);
    }
    return { success: false, error: `Failed to update customer: ${error}` };
  }
}
