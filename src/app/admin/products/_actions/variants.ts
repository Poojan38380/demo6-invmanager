"use server";

import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface VariantDataProps {
  variantId: string;
  variantNewName: string;
}

interface EditVariantsProps {
  productId: string;
  variants: VariantDataProps[];
}

export async function EditVariants({ data }: { data: EditVariantsProps }) {
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
      prisma.product.findUnique({
        where: { id: data.productId },
        include: { productVariants: true },
      }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }
    if (!product) {
      throw new Error("Product not found.");
    }

    const updatePromises = data.variants.map(async (variant) => {
      if (variant.variantId.startsWith("temp-")) {
        // Create new variant
        return prisma.productVariant.create({
          data: {
            variantName: variant.variantNewName,
            productId: data.productId,
            variantStock: 0,
          },
        });
      } else {
        // Update existing variant
        return prisma.productVariant.update({
          where: { id: variant.variantId },
          data: { variantName: variant.variantNewName },
        });
      }
    });

    await Promise.all(updatePromises);

    const notificationMessage = `
Product variants updated:
Product: ${product.name}
Updated by: ${updater.username}
Number of variants: ${data.variants.length}
    `;

    await sendTelegramMessage(notificationMessage);
    revalidateTag("get-products-for-table");
    revalidateTag("get-all-transactions");
    revalidatePath("/admin/products");
    revalidatePath("/admin/transactions");
    revalidatePath(`/admin/transactions/product/${data.productId}`);
    revalidatePath(`/admin/products/${data.productId}`);

    return { success: true, productId: data.productId };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in EditVariants server action: ", error.stack);
    }
    return { success: false, error: `Failed to update variants: ${error}` };
  }
}
