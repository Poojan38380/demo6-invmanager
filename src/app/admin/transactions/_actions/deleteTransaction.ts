"use server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { encodeURLid } from "@/utils/url-encoder-decoder";

export async function deleteTransaction({
  transactionId,
}: {
  transactionId: string;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const updaterId = session.user.id;

  if (!updaterId) return redirect("/login");

  try {
    const [updater, transaction] = await Promise.all([
      prisma.user.findUnique({ where: { id: updaterId } }),
      prisma.transaction.findFirst({
        where: {
          id: transactionId,
        },
        include: {
          product: { select: { name: true, stock: true } },
          productVariant: { select: { variantName: true, variantStock: true } },
        },
      }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    if (transaction.productVariantId && transaction.productVariant) {
      const stockAfter =
        transaction.productVariant.variantStock - transaction.stockChange;
      await prisma.productVariant.update({
        where: { id: transaction.productVariantId },
        data: { variantStock: stockAfter },
      });
    } else {
      const stockAfter = transaction.product.stock - transaction.stockChange;
      await prisma.product.update({
        where: { id: transaction.productId },
        data: { stock: stockAfter },
      });
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    const notificationMessage = `
*A TRANSACTION HAS BEEN DELETED !!!*

Transaction creation time : *${formatDateYYMMDDHHMM(transaction.createdAt)}*
Product: *${transaction.product.name}* 
${
  transaction.productVariant
    ? `Variant: *${transaction.productVariant.variantName}*`
    : ""
}
StockChange: *${transaction.stockChange}*
`;

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: [
          "/admin/products",
          "/products",
          "/admin/transactions",
          "/admin",
          `/admin/transactions/product/${encodeURLid(transaction.productId)}`,
          `/admin/transactions/product/variant/${encodeURLid(
            transaction.productVariantId
          )}`,
          `/admin/transactions/user/${encodeURLid(transaction.userId)}`,
          `/admin/transactions/vendor/${encodeURLid(transaction.vendorId)}`,
          `/admin/transactions/customer/${encodeURLid(transaction.customerId)}`,
        ],
        tagsToRevalidate: [
          "get-products-for-table",
          "get-products-for-display",
          "get-all-transactions",
        ],
      }),
    ]);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in deleteTransaction server action: ", error.stack);
    }
    return { success: false, error: `Failed to delete transaction: ${error}` };
  }
}
