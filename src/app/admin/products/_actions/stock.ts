"use server";

import { auth } from "@/lib/auth";
import { formatNumber } from "@/lib/formatter";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
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

    const routesToRevalidate = [
      "/admin",
      "/admin/products",
      "/admin/transactions",
      `/admin/transactions/product/${data.productId}`,
      `/admin/transactions/user/${updater.id}`,
      ...(data.customerId
        ? [`/admin/transactions/customer/${data.customerId}`]
        : []),
      ...(data.vendorId
        ? [`/admin/transactions/supplier/${data.vendorId}`]
        : []),
    ].filter(Boolean);

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate,
        tagsToRevalidate: ["get-products-for-table", "get-all-transactions"],
      }),
    ]);

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
  variantId: string[];
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
      !data.productId ||
      data.productId.length !== 24 ||
      !/^[a-fA-F0-9]{24}$/.test(data.productId)
    ) {
      throw new Error("Invalid Product ID.");
    }

    const updaterId = session.user.id;

    if (!updaterId) return redirect("/login");
    const [updater, variants, product] = await Promise.all([
      prisma.user.findUnique({ where: { id: updaterId } }),
      prisma.productVariant.findMany({
        where: {
          id: { in: data.variantId },
        },
      }),
      prisma.product.findUnique({ where: { id: data.productId } }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }

    if (!product) {
      throw new Error("Product not found.");
    }
    if (!variants || variants.length === 0) {
      throw new Error("Product Variants not found.");
    }

    const variantUpdates = variants.map((variant) => {
      const stockBefore = variant.variantStock;
      const stockAfter = stockBefore + data.change;

      return {
        variant,
        stockBefore,
        stockAfter,
      };
    });

    // Use a transaction to update both the variant and the parent product
    await prisma.$transaction([
      ...variantUpdates.map((update) =>
        prisma.productVariant.update({
          where: { id: update.variant.id },
          data: { variantStock: update.stockAfter },
        })
      ),
      prisma.product.update({
        where: { id: data.productId },
        data: { updatedAt: new Date() },
      }),
    ]);

    const action = data.change > 0 ? "INCREASED" : "DECREASED";

    await prisma.transaction.createMany({
      data: variantUpdates.map((update) => ({
        action,
        stockBefore: update.stockBefore,
        stockChange: data.change,
        stockAfter: update.stockAfter,
        note: data.transactionNote,
        productVariantId: update.variant.id,
        productId: data.productId,
        userId: updaterId,
        customerId: data.customerId,
        vendorId: data.vendorId,
      })),
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
    const variantUpdatesText = variantUpdates
      .map(
        (update) => `
Variant: *${update.variant.variantName}*
- Stock Before: ${formatNumber(update.stockBefore)} ${product.unit}
- Final Stock: *${formatNumber(update.stockAfter)} ${product.unit}*`
      )
      .join("\n");

    const notificationMessage = `
Product: *${product.name}*
User: *${updater.username}*   
*${action}*
- Change: *${data.change > 0 ? "+" : ""}${formatNumber(data.change)}*

${variantUpdatesText}

${data.transactionNote ? `- Note: ${data.transactionNote || ""}` : ""}
${customer ? `-Customer: ${customer.companyName}` : ""}
${vendor ? `-Supplier: ${vendor.companyName}` : ""}
`;

    const routesToRevalidate = [
      "/admin/products",
      "/admin/transactions",
      `/admin/transactions/product/${data.productId}`,
      `/admin/transactions/user/${updater.id}`,
      ...(data.customerId
        ? [`/admin/transactions/customer/${data.customerId}`]
        : []),
      ...(data.vendorId
        ? [`/admin/transactions/supplier/${data.vendorId}`]
        : []),
      "/admin",
    ].filter(Boolean);

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate,
        tagsToRevalidate: ["get-products-for-table", "get-all-transactions"],
      }),
    ]);

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
