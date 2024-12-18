"use server";

import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { Product } from "@prisma/client";
import {
  unstable_cache as cache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import { uploadImagesToCloudinary } from "./cloudinary";
import { sendTelegramMessage } from "@/lib/send-telegram-message";

export type ProductWithOneImage = Product & {
  productImages: {
    url: string;
  }[];
  vendor: {
    companyName: string;
  } | null;
  category: {
    name: string;
  } | null;
};

async function getProductsforTable(): Promise<ProductWithOneImage[]> {
  // Fetch data from your API here.
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      vendor: {
        select: { companyName: true },
      },
      category: { select: { name: true } },
      productImages: {
        take: 1,
        select: { url: true },
      },
    },
  });
  return products;
}

export const getCachedProductsforTable = cache(
  async () => getProductsforTable(),
  ["get-products-for-table"]
);

interface addproductProps {
  name: string;
  stock: number;
  unit: string;
  bufferStock?: number | undefined;
  shortDescription?: string | undefined;
  longDescription?: string | undefined;
  costPrice?: number | undefined;
  sellingPrice?: number | undefined;
  vendorId?: string | undefined;
  categoryId?: string | undefined;
  images?: File[] | undefined;
}

export async function addProduct(data: addproductProps, productImages: File[]) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const creatorId = session.user.id;

  if (!creatorId) return redirect("/login");

  try {
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new Error("User not found in database.Login Again");
    }

    const productImageUrls = await uploadImagesToCloudinary(productImages);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        stock: data.stock,
        bufferStock: data.bufferStock,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        unit: data.unit,
        vendorId: data.vendorId,
        categoryId: data.categoryId,
        creatorId,
        productImages: {
          create: productImageUrls?.map((url: string) => ({ url })) || [],
        },
      },
    });

    await prisma.transaction.create({
      data: {
        action: "CREATED",
        stockBefore: 0,
        stockChange: data.stock,
        stockAfter: data.stock,
        productId: product.id,
        userId: creatorId,
        vendorId: data.vendorId,
      },
    });

    const notificationMessage = `A new product has been created by ${
      creator?.username
    }:
    - Product Name: ${data.name} 
    - Initial Stock: ${data.stock}
    - Buffer Stock: ${data.bufferStock || "N/A"}
    - Cost Price: ${data.costPrice || "N/A"}
    - Selling Price: ${data.sellingPrice || "N/A"}
    `;

    await sendTelegramMessage(notificationMessage);

    revalidateTag("get-products-for-table");
    revalidatePath("/admin/products");
    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
  }
}
