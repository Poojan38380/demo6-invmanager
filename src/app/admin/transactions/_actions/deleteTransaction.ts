"use server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";

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
          product: { select: { name: true } },
          productVariant: { select: { variantName: true } },
        },
      }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }

    if (!transaction) {
      throw new Error("Transaction not found.");
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

    await sendTelegramMessage(notificationMessage);

    const routesToRevalidate = [
      "/admin/products",
      "/products",
      "/admin/transactions",
      "/admin",
    ];

    const tagsToRevalidate = [
      "get-products-for-table",
      "get-products-for-display",
      "get-all-transactions",
    ];

    routesToRevalidate.forEach((route) => revalidatePath(route));
    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in deleteTransaction server action: ", error.stack);
    }
    return { success: false, error: `Failed to delete transaction: ${error}` };
  }
}
