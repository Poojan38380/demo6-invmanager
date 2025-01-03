"use server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { formatNumber } from "@/lib/formatter";
import { sendTelegramMessage } from "@/lib/send-telegram-message";

export async function deleteProduct({ productId }: { productId: string }) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const updaterId = session.user.id;

  if (!updaterId) return redirect("/login");

  try {
    const [updater, product, existingTransactions] = await Promise.all([
      prisma.user.findUnique({ where: { id: updaterId } }),
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.transaction.findFirst({
        where: {
          productId,
          action: { not: "CREATED" },
        },
      }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }

    if (!product) {
      throw new Error("Product not found.");
    }

    if (existingTransactions) {
      throw new Error("Please delete transactions first.");
    }

    const stockBefore = product.stock;

    // Delete related records first
    await prisma.$transaction([
      prisma.transaction.deleteMany({
        where: { productId },
      }),
      // Delete product images
      prisma.productImage.deleteMany({
        where: { productId },
      }),
      // Delete product variants
      prisma.productVariant.deleteMany({
        where: { productId },
      }),
      // Delete the product
      prisma.product.delete({
        where: { id: productId },
      }),
    ]);

    const notificationMessage = `
*A PRODUCT HAS BEEN DELETED !!!*

Product: *${product.name}*
User: *${updater.username}*   

- Stock at deletion: ${formatNumber(stockBefore)} ${product.unit}
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

    return { success: true, productId: productId };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in deleteProduct server action: ", error.stack);
    }
    return { success: false, error: `Failed to delete product: ${error}` };
  }
}
