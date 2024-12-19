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
import { ProductWithImages } from "@/types/productWithImages";

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

async function getSingleProduct(id: string): Promise<ProductWithImages | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      productImages: { select: { url: true } },
    },
  });
  return product;
}

export const getCachedSingleProduct = cache(
  async (id: string): Promise<ProductWithImages | null> => getSingleProduct(id),
  ["get-single-product-for-edit"]
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
    revalidateTag("get-all-transactions");
    revalidatePath("/admin/products");
    revalidatePath("/admin/transactions");
    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
  }
}

interface editProductProps {
  productId: string;
  name: string;
  bufferStock?: number | undefined;
  unit: string;
  shortDescription?: string | undefined;
  longDescription?: string | undefined;
  costPrice?: number | undefined;
  sellingPrice?: number | undefined;
  vendorId?: string | undefined;
  categoryId?: string | undefined;
  productPrevImageUrls: string[];
}
export async function editProduct(
  data: editProductProps,
  productImages: File[]
) {
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
    const [updater, existingProduct] = await Promise.all([
      prisma.user.findUnique({ where: { id: updaterId } }),
      prisma.product.findUnique({ where: { id: data.productId } }),
    ]);

    if (!updater) {
      throw new Error("User not found.");
    }

    if (!existingProduct) {
      throw new Error("Product not found.");
    }

    const productImageUrls = await uploadImagesToCloudinary(productImages);

    await Promise.all([
      prisma.product.update({
        where: { id: data.productId },
        data: {
          name: data.name,
          bufferStock: data.bufferStock,
          shortDescription: data.shortDescription,
          longDescription: data.longDescription,
          costPrice: data.costPrice,
          sellingPrice: data.sellingPrice,
          unit: data.unit,
          categoryId: data.categoryId,
          vendorId: data.vendorId,
        },
      }),
      handleProductImages(
        data.productId,
        data.productPrevImageUrls,
        productImageUrls
      ),
    ]);

    const notificationMessage = `Details of product ${existingProduct.name} has been updated by ${updater.username}`;

    await sendTelegramMessage(notificationMessage);

    revalidateTag("get-single-product-for-edit");
    revalidateTag("get-products-for-table");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${existingProduct.id}`);

    return { success: true, message: "Product edited successfully." };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to edit product" };
  }
}

async function handleProductImages(
  productId: string,
  prevImageUrls: string[],
  newImageUrls: string[]
) {
  const updatedProductImages = [...prevImageUrls, ...newImageUrls];

  if (updatedProductImages.length > 0) {
    await prisma.productImage.deleteMany({ where: { productId } });

    const imageRecords = updatedProductImages.map((url) => ({
      productId,
      url,
    }));
    await prisma.productImage.createMany({ data: imageRecords });
  }
}
