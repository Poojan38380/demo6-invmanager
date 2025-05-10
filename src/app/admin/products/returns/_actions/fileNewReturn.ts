import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { encodeURLid } from "@/utils/url-encoder-decoder";
import { redirect } from "next/navigation";

interface fileNewReturnProps {
  productId: string;
  userId: string;
  returnQty: number;
  productName: string;
  productVariantName?: string;

  productVariantId?: string;
  returnReason?: string;
  customerId?: string;
  customerName?: string;
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

    const dbOperations = [];

    dbOperations.push(
      prisma.return.create({
        data: {
          productId: data.productId,
          returnQty: data.returnQty,
          returnReason: data.returnReason,
          customerId: data.customerId,
          productVariantId: data.productVariantId,
          userId: creatorId,
        },
      })
    );

    dbOperations.push(
      prisma.transaction.create({
        data: {
          action: "INCREASED",
          stockBefore: product.stock,
          stockChange: data.returnQty,
          stockAfter: product.stock + data.returnQty,
          productId: data.productId,
          userId: creatorId,
          note: data.returnReason,
          customerId: data.customerId,
          productVariantId: data.productVariantId,
        },
      })
    );

    await Promise.all(dbOperations);

    const notificationMessage = `A new return has been filed by ${creatorUsername}:
    - Product Name: ${data.productName} 
    - Return Qty: ${data.returnQty}
    - Return Reason: ${data.returnReason}
    ${data.customerName ? `- Customer: ${data.customerName}` : ""}
     ${
       data.productVariantName
         ? `\nVariant Name: ${data.productVariantName}`
         : ""
     }`;

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
          `admin/products/report/${encodeURLid(data.productId)}`,
          `admin/transactions/product/${encodeURLid(data.productId)}`,
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
