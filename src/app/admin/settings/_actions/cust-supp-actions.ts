"use server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

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

    revalidateTag("get-suppliers");
    revalidatePath("/admin/settings/suppliers");
    return { success: true, supplierId: newSupplier.id };
  } catch (error) {
    console.error("Error creating supplier:", error);
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

    revalidateTag("get-customers");
    revalidatePath("/admin/settings/customers");
    return { success: true, customerId: newCustomer.id };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: `Failed to create customer: ${error}` };
  }
}
