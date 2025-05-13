"use server";

import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { encodeURLid } from "@/utils/url-encoder-decoder";
import { redirect } from "next/navigation";

interface fileNewReturnProps {
  productId: string;
  returnQty: number;
  productName: string;

  productVariantId?: string;
  returnReason?: string;
  customerId?: string;

  productVariantName?: string;
}

export async function fileNewReturn(data: fileNewReturnProps) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const creatorId = session.user.id;
  const creatorUsername = session.user.username;

  if (!creatorId) return redirect("/login");

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: data.productId,
      },
      select: {
        stock: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    let customer;

    if (data.customerId) {
      customer = await prisma.customer.findUnique({
        where: {
          id: data.customerId,
        },
      });

      if (!customer) {
        throw new Error("Customer not found");
      }
    }

    const dbOperations = [];

    dbOperations.push(
      prisma.return.create({
        data: {
          productId: data.productId,
          returnQty: data.returnQty,
          returnReason: data.returnReason,
          customerId: data.customerId ? data.customerId : null,
          productVariantId: data.productVariantId,
          userId: creatorId,
        },
      })
    );
    dbOperations.push(
      prisma.product.update({
        where: { id: data.productId },
        data: { stock: { increment: data.returnQty } },
      })
    );
    dbOperations.push(
      prisma.transaction.create({
        data: {
          action: "RETURNED",
          stockBefore: product.stock,
          stockChange: data.returnQty,
          stockAfter: product.stock + data.returnQty,
          productId: data.productId,
          userId: creatorId,
          note: data.returnReason,
          customerId: data.customerId ? data.customerId : null,
          productVariantId: data.productVariantId,
        },
      })
    );

    await Promise.all(dbOperations);

    const notificationMessage = `A new return has been filed by ${creatorUsername}:
    - Product Name: ${data.productName} 
    - Return Qty: ${data.returnQty}
    - Return Reason: ${data.returnReason}
    ${customer ? `- Customer: ${customer.companyName}` : ""}
    ${data.productVariantName ? `- Variant Name: ${data.productVariantName}` : ""}`;

    // Send notification and revalidate paths in parallel

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: [
          "/admin/products",
          "/products",
          "/admin/transactions",
          "/admin",
          "/admin/returns",
          `/admin/products/report/${encodeURLid(data.productId)}`,
          `/admin/transactions/product/${encodeURLid(data.productId)}`,
          "/admin/products/returns",
          ...(data.customerId ? [`/admin/transactions/customer/${encodeURLid(data.customerId)}`] : []),
          ...(data.productVariantId ? [`/admin/transactions/product/variant/${encodeURLid(data.productVariantId)}`] : []),
        ],
        tagsToRevalidate: [
          "get-products-for-table",
          "get-products-for-display",
          "get-all-transactions",
          "get-product-last-transactions",
        ],
      }),
    ]);
    return { success: true, returnId: (await dbOperations[0]).id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in fileNewReturn server action: ", error.stack);
    }
    return { success: false, error: `Failed to file new return: ${error}` };
  }
}
