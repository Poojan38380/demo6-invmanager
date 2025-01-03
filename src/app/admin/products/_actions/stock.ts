"use server";

import { auth } from "@/lib/auth";
import { formatNumber } from "@/lib/formatter";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface updateProductStockProps {
  productId: string;
  change: number;
  customerId?: string;
  vendorId?: string;
  transactionNote?: string;
}

export async function updateProductStock({
  data,
}: {
  data: updateProductStockProps;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized. Login first.");
  }
  try {
    if (
      !data.productId ||
      data.productId.length !== 24 ||
      !/^[a-fA-F0-9]{24}$/.test(data.productId)
    ) {
      throw new Error("Invalid Product ID.");
    }

    const updaterId = session.user.id;

    if (!updaterId) return redirect("/login");
    const [updater, product] = await Promise.all([
      prisma.user.findUnique({ where: { id: updaterId } }),
      prisma.product.findUnique({ where: { id: data.productId } }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }

    if (!product) {
      throw new Error("Product not found.");
    }

    const stockBefore = product.stock;
    const stockAfter = stockBefore + data.change;

    await prisma.product.update({
      where: { id: data.productId },
      data: { stock: stockAfter },
    });

    const action = data.change > 0 ? "INCREASED" : "DECREASED";

    await prisma.transaction.create({
      data: {
        action,
        stockBefore,
        stockChange: data.change,
        stockAfter,
        note: data.transactionNote,
        productId: data.productId,
        userId: updaterId,
        customerId: data.customerId,
        vendorId: data.vendorId,
      },
    });

    let customer, vendor;
    if (data.customerId) {
      customer = await prisma.customer.findUnique({
        where: { id: data.customerId },
      });
    }
    if (data.vendorId) {
      vendor = await prisma.vendor.findUnique({
        where: { id: data.vendorId },
      });
    }

    // Craft a notification
    const notificationMessage = `
Product: *${product.name}*
User: *${updater.username}*   
*${action}*

- Stock Before: ${formatNumber(stockBefore)} ${product.unit}
    - Change: *${data.change > 0 ? "+" : ""}${formatNumber(data.change)}*
    - Final Stock: *${formatNumber(stockAfter)} ${product.unit}*

${data.transactionNote ? `- Note: ${data.transactionNote || ""}` : ""}
${customer ? `-Customer: ${customer.companyName}` : ""}
${vendor ? `-Supplier: ${vendor.companyName}` : ""}
  
  `;

    await sendTelegramMessage(notificationMessage);
    revalidateTag("get-products-for-table");
    revalidateTag("get-all-transactions");
    revalidatePath("/admin/products");
    revalidatePath("/admin/transactions");
    revalidatePath(`/admin/transactions/product/${data.productId}`);
    revalidatePath(`/admin/transactions/user/${updater.id}`);
    if (data.customerId)
      revalidatePath(`/admin/transactions/customer/${data.customerId}`);
    if (data.vendorId)
      revalidatePath(`/admin/transactions/supplier/${data.vendorId}`);
    revalidatePath("/admin");

    return { success: true, productId: data.productId };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in updateProductStock server action: ", error.stack);
    }
    return { success: false, error: "Failed to update product stock" };
  }
}
interface updateProductVariantStockProps {
  productId: string;
  variantId: string;
  change: number;
  customerId?: string;
  vendorId?: string;
  transactionNote?: string;
}

export async function updateProductVariantStock({
  data,
}: {
  data: updateProductVariantStockProps;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized. Login first.");
  }
  try {
    if (
      !data.variantId ||
      data.variantId.length !== 24 ||
      !/^[a-fA-F0-9]{24}$/.test(data.variantId)
    ) {
      throw new Error("Invalid Product ID.");
    }

    const updaterId = session.user.id;

    if (!updaterId) return redirect("/login");
    const [updater, variant, product] = await Promise.all([
      prisma.user.findUnique({ where: { id: updaterId } }),
      prisma.productVariant.findUnique({ where: { id: data.variantId } }),
      prisma.product.findUnique({ where: { id: data.productId } }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }

    if (!product) {
      throw new Error("Product not found.");
    }
    if (!variant) {
      throw new Error("Product Variant not found.");
    }

    const stockBefore = variant.variantStock;
    const stockAfter = stockBefore + data.change;

    // Use a transaction to update both the variant and the parent product
    await prisma.$transaction([
      prisma.productVariant.update({
        where: { id: data.variantId },
        data: { variantStock: stockAfter },
      }),
      prisma.product.update({
        where: { id: data.productId },
        data: { updatedAt: new Date() },
      }),
    ]);

    const action = data.change > 0 ? "INCREASED" : "DECREASED";

    await prisma.transaction.create({
      data: {
        action,
        stockBefore,
        stockChange: data.change,
        stockAfter,
        note: data.transactionNote,
        productVariantId: data.variantId,
        productId: data.productId,
        userId: updaterId,
        customerId: data.customerId,
        vendorId: data.vendorId,
      },
    });

    let customer, vendor;
    if (data.customerId) {
      customer = await prisma.customer.findUnique({
        where: { id: data.customerId },
      });
    }
    if (data.vendorId) {
      vendor = await prisma.vendor.findUnique({
        where: { id: data.vendorId },
      });
    }

    // Craft a notification
    const notificationMessage = `
Product: *${product.name}*
Variant: *${variant.variantName}*
User: *${updater.username}*   
*${action}*

- Stock Before: ${formatNumber(stockBefore)} ${product.unit}
    - Change: *${data.change > 0 ? "+" : ""}${formatNumber(data.change)}*
    - Final Stock: *${formatNumber(stockAfter)} ${product.unit}*

${data.transactionNote ? `- Note: ${data.transactionNote || ""}` : ""}
${customer ? `-Customer: ${customer.companyName}` : ""}
${vendor ? `-Supplier: ${vendor.companyName}` : ""}
  
  `;

    await sendTelegramMessage(notificationMessage);
    revalidateTag("get-products-for-table");
    revalidateTag("get-all-transactions");
    revalidatePath("/admin/products");
    revalidatePath("/admin/transactions");
    revalidatePath(`/admin/transactions/product/${data.productId}`);
    revalidatePath(`/admin/transactions/user/${updater.id}`);
    if (data.customerId)
      revalidatePath(`/admin/transactions/customer/${data.customerId}`);
    if (data.vendorId)
      revalidatePath(`/admin/transactions/supplier/${data.vendorId}`);
    revalidatePath("/admin");

    return { success: true, variantId: data.variantId };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error in updateProductVariantStock server action: ",
        error.stack
      );
    }
    return { success: false, error: "Failed to update product variant stock" };
  }
}
