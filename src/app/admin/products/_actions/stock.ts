"use server";

import { auth } from "@/lib/auth";
import { formatNumber } from "@/lib/formatter";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { encodeURLid } from "@/utils/url-encoder-decoder";
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
    return { success: false, error: "Unauthorized. Login first." };
  }
  try {
    if (
      !data.productId ||
      data.productId.length !== 24 ||
      !/^[a-fA-F0-9]{24}$/.test(data.productId)
    ) {
      return { success: false, error: "Invalid Product ID." };
    }

    const updaterId = session.user.id;

    if (!updaterId) return redirect("/login");
    const [updater, product, settings] = await Promise.all([
      prisma.user.findUnique({ where: { id: updaterId } }),
      prisma.product.findUnique({ where: { id: data.productId } }),
      prisma.settings.findFirst(),
    ]);

    if (!updater) {
      return { success: false, error: "User not found." };
    }

    if (!product) {
      return { success: false, error: "Product not found." };
    }

    if (settings) {
      if (data.change < 0 && settings.customerMandatory && !data.customerId) {
        return {
          success: false,
          error: "Customer information is required for stock reduction.",
        };
      }

      if (data.change > 0 && settings.supplierMandatory && !data.vendorId) {
        return {
          success: false,
          error: "Supplier information is required for stock addition.",
        };
      }
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
      `/admin/transactions/product/${encodeURLid(data.productId)}`,
      `/admin/transactions/user/${encodeURLid(updater.id)}`,
      ...(data.customerId
        ? [`/admin/transactions/customer/${encodeURLid(data.customerId)}`]
        : []),
      ...(data.vendorId
        ? [`/admin/transactions/supplier/${encodeURLid(data.vendorId)}`]
        : []),
    ].filter(Boolean);

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate,
        tagsToRevalidate: [
          "get-products-for-table",
          "get-all-transactions",
          "get-product-last-transactions",
        ],
      }),
    ]);

    return { success: true, productId: data.productId };
  } catch (error) {
    console.error("Error in updateProductStock server action: ", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
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
    return { success: false, error: "Unauthorized. Login first." };
  }

  try {
    if (
      !data.productId ||
      data.productId.length !== 24 ||
      !/^[a-fA-F0-9]{24}$/.test(data.productId)
    ) {
      return { success: false, error: "Invalid Product ID." };
    }

    const updaterId = session.user.id;
    if (!updaterId) return redirect("/login");

    // Optimize database queries by including only necessary fields
    const [updater, variants, product, settings] = await Promise.all([
      prisma.user.findUnique({
        where: { id: updaterId },
        select: { id: true, username: true },
      }),
      prisma.productVariant.findMany({
        where: { id: { in: data.variantId } },
        select: { id: true, variantStock: true, variantName: true },
      }),
      prisma.product.findUnique({
        where: { id: data.productId },
        select: { id: true, name: true, unit: true },
      }),
      prisma.settings.findFirst(),
    ]);

    // Validate entities
    if (!updater || !product || !variants.length) {
      if (!updater) return { success: false, error: "User not found." };
      else if (!product) return { success: false, error: "Product not found." };
      else return { success: false, error: "Product Variants not found." };
    }

    if (settings) {
      if (data.change < 0 && settings.customerMandatory && !data.customerId) {
        throw new Error(
          "Customer information is required for stock reduction."
        );
      }

      if (data.change > 0 && settings.supplierMandatory && !data.vendorId) {
        throw new Error("Supplier information is required for stock addition.");
      }
    }

    const variantUpdates = variants.map((variant) => ({
      variant,
      stockBefore: variant.variantStock,
      stockAfter: variant.variantStock + data.change,
    }));

    // Prepare all database operations
    const dbOperations = [
      // Batch variant updates
      prisma.productVariant.updateMany({
        where: { id: { in: data.variantId } },
        data: { variantStock: { increment: data.change } },
      }),
      // Update product timestamp
      prisma.product.update({
        where: { id: data.productId },
        data: { updatedAt: new Date() },
      }),
      // Batch create transactions
      prisma.transaction.createMany({
        data: variantUpdates.map((update) => ({
          action: data.change > 0 ? "INCREASED" : "DECREASED",
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
      }),
    ];

    // Conditionally fetch customer and vendor in parallel if needed
    const [customer, vendor] = await Promise.all([
      data.customerId
        ? prisma.customer.findUnique({
            where: { id: data.customerId },
            select: { companyName: true },
          })
        : null,
      data.vendorId
        ? prisma.vendor.findUnique({
            where: { id: data.vendorId },
            select: { companyName: true },
          })
        : null,
    ]);

    // Execute all database operations in a single transaction
    await prisma.$transaction(dbOperations);

    // Prepare notification message
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
*${data.change > 0 ? "INCREASED" : "DECREASED"}*
- Change: *${data.change > 0 ? "+" : ""}${formatNumber(data.change)}*

${variantUpdatesText}

${data.transactionNote ? `- Note: ${data.transactionNote}` : ""}
${customer ? `-Customer: ${customer.companyName}` : ""}
${vendor ? `-Supplier: ${vendor.companyName}` : ""}
`;

    const routesToRevalidate = [
      "/admin",
      "/admin/products",
      "/admin/transactions",
      `/admin/transactions/product/${encodeURLid(data.productId)}`,
      ...data.variantId.map(
        (id) => `/admin/transactions/product/variant/${encodeURLid(id)}`
      ),
      `/admin/transactions/user/${encodeURLid(updater.id)}`,
      ...(data.customerId
        ? [`/admin/transactions/customer/${encodeURLid(data.customerId)}`]
        : []),
      ...(data.vendorId
        ? [`/admin/transactions/supplier/${encodeURLid(data.vendorId)}`]
        : []),
    ];

    // Fire and forget notifications and cache revalidation
    Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate,
        tagsToRevalidate: [
          "get-products-for-table",
          "get-all-transactions",
          "get-product-last-transactions",
        ],
      }),
    ]).catch(console.error); // Handle errors but don't wait for completion

    return { success: true, variantId: data.variantId };
  } catch (error) {
    console.error("Error in updateProductVariantStock server action: ", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update product variant stock" };
  }
}
