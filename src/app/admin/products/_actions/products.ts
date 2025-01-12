"use server";

import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { Product, ProductVariant, TransactionAction } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImagesToCloudinary } from "./cloudinary";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import { ProductWithImages } from "@/types/dataTypes";
import cacheRevalidate from "@/utils/cache-revalidation-helper";

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
  lastMonthSales: number;
  specialTransactionCount: number;
  productVariants: ProductVariant[];
};

async function getProductsforTable(): Promise<ProductWithOneImage[]> {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

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
      transactions: {
        where: {
          action: "DECREASED",
          createdAt: {
            gte: oneMonthAgo,
          },
        },
        select: {
          stockChange: true,
        },
      },
      productVariants: true,
      _count: {
        select: {
          transactions: { where: { action: { not: "CREATED" } } },
        },
      },
    },
  });

  const productsWithSales = products.map((product) => {
    const lastMonthSales = product.transactions.reduce(
      (total, transaction) => total + Math.abs(transaction.stockChange),
      0
    );
    return {
      ...product,
      lastMonthSales,
      specialTransactionCount: product._count.transactions,
    };
  });

  return productsWithSales;
}

export const getCachedProductsforTable = cache(
  async () => getProductsforTable(),
  ["get-products-for-table"]
);

export type ProductTransaction = {
  id: string;
  createdAt: Date;
  action: TransactionAction;
  stockBefore: number;
  stockChange: number;
  stockAfter: number;
  note: string | null;
  user: {
    username: string;
  };
  customer: {
    id: string;
    companyName: string;
  } | null;
  vendor: {
    id: string;
    companyName: string;
  } | null;
  productVariant: {
    id: string;
    variantName: string;
  } | null;
};

async function getProductLastTransactions(
  productId: string
): Promise<ProductTransaction[]> {
  const transactions = await prisma.transaction.findMany({
    where: {
      productId: productId,
      action: { in: ["DECREASED", "INCREASED"] },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      createdAt: true,
      action: true,
      stockBefore: true,
      stockChange: true,
      stockAfter: true,
      note: true,
      user: {
        select: {
          username: true,
        },
      },
      customer: {
        select: {
          id: true,
          companyName: true,
        },
      },
      vendor: {
        select: {
          id: true,
          companyName: true,
        },
      },
      productVariant: {
        select: {
          id: true,
          variantName: true,
        },
      },
    },
  });

  return transactions;
}

export const getCachedProductLastTransactions = cache(
  async (productId: string) => getProductLastTransactions(productId),
  ["get-product-last-transactions"]
);

async function getSingleProduct(id: string): Promise<ProductWithImages | null> {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      productImages: true,
      productVariants: true,
      transactions: {
        where: {
          action: "DECREASED",
          createdAt: {
            gte: oneMonthAgo,
          },
        },
        select: {
          stockChange: true,
        },
      },
    },
  });

  if (!product) return null;

  const lastMonthSales = product.transactions.reduce(
    (sum, transaction) => sum + Math.abs(transaction.stockChange),
    0
  );

  return {
    ...product,
    lastMonthSales,
  };
}

export const getCachedSingleProduct = cache(
  async (id: string): Promise<ProductWithImages | null> => getSingleProduct(id),
  ["get-single-product-for-edit"]
);
interface addVariantProps {
  variantName: string;
  variantStock: number;
}
interface addproductProps {
  name: string;
  stock: number;
  unit: string;
  bufferStock?: number | undefined;
  shortDescription?: string | undefined;
  longDescription?: string | undefined;

  vendorId?: string | undefined;
  categoryId?: string | undefined;
  qtyInBox?: number | undefined;
  productVariants?: addVariantProps[];
}

export async function addProduct(data: addproductProps, productImages: File[]) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const creatorId = session.user.id;
  const creatorUsername = session.user.username;

  if (!creatorId) return redirect("/login");

  try {
    // Start image upload and initial product creation in parallel
    const [productImageUrls, product] = await Promise.all([
      uploadImagesToCloudinary(productImages),
      prisma.product.create({
        data: {
          name: data.name,
          stock: data.stock,
          bufferStock: data.bufferStock,
          shortDescription: data.shortDescription,
          longDescription: data.longDescription,
          unit: data.unit,
          hasVariants: data.productVariants && data.productVariants?.length > 0,
          vendorId: data.vendorId,
          categoryId: data.categoryId,
          creatorId,
          qtyInBox: data.qtyInBox,
          productImages: {
            create: [],
          },
        },
      }),
    ]);

    // Prepare all database operations
    const dbOperations = [];

    // Add product images if they exist
    if (productImageUrls?.length) {
      dbOperations.push(
        prisma.product.update({
          where: { id: product.id },
          data: {
            productImages: {
              create: productImageUrls.map((url: string) => ({ url })),
            },
          },
        })
      );
    }

    // Add initial product transaction
    dbOperations.push(
      prisma.transaction.create({
        data: {
          action: "CREATED",
          stockBefore: 0,
          stockChange: data.stock,
          stockAfter: data.stock,
          productId: product.id,
          userId: creatorId,
          vendorId: data.vendorId,
        },
      })
    );

    // Prepare variant operations if they exist
    if (data.productVariants?.length) {
      const variantOperations = data.productVariants.map((variant) =>
        prisma.productVariant
          .create({
            data: {
              variantName: variant.variantName,
              variantStock: variant.variantStock,
              productId: product.id,
            },
          })
          .then((createdVariant) =>
            prisma.transaction.create({
              data: {
                action: "CREATED",
                stockBefore: 0,
                stockChange: variant.variantStock,
                stockAfter: variant.variantStock,
                productId: product.id,
                productVariantId: createdVariant.id,
                userId: creatorId,
                vendorId: data.vendorId,
              },
            })
          )
      );
      dbOperations.push(...variantOperations);
    }

    // Execute all database operations concurrently
    await Promise.all(dbOperations);

    // Prepare notification message
    const notificationMessage = `A new product has been created by ${creatorUsername}:
    - Product Name: ${data.name} 
    - Initial Stock: ${data.stock}
     ${
       data.productVariants?.length
         ? `\nVariants:\n${data.productVariants
             .map((v) => `- ${v.variantName}: Initial Stock ${v.variantStock}`)
             .join("\n")}`
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
        ],
        tagsToRevalidate: [
          "get-products-for-table",
          "get-products-for-display",
          "get-all-transactions",
        ],
      }),
    ]);

    return { success: true, productId: product.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addProduct server action: ", error.stack);
    }
    return { success: false, error: `Failed to add product: ${error}` };
  }
}

interface editProductProps {
  productId: string;
  name: string;
  bufferStock?: number | undefined;
  unit: string;
  shortDescription?: string | undefined;
  longDescription?: string | undefined;

  vendorId?: string | undefined;
  categoryId?: string | undefined;
  productPrevImageUrls: string[];
  qtyInBox?: number;
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

    const updatedProductImages = [
      ...data.productPrevImageUrls,
      ...productImageUrls,
    ];

    await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: data.productId },
        data: {
          name: data.name,
          bufferStock: data.bufferStock,
          shortDescription: data.shortDescription,
          longDescription: data.longDescription,
          unit: data.unit,
          categoryId: data.categoryId,
          vendorId: data.vendorId,
          qtyInBox: data.qtyInBox,
        },
      });

      await tx.productImage.deleteMany({
        where: { productId: data.productId },
      });

      if (updatedProductImages.length > 0) {
        const imageRecords = updatedProductImages.map((url) => ({
          productId: data.productId,
          url,
        }));

        await tx.productImage.createMany({ data: imageRecords });
      }

      return updatedProduct;
    });

    const notificationMessage = `Details of product: *${existingProduct.name}* has been updated by user: *${updater.username}*`;

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: [
          "/admin/products",
          "/products",
          "/admin",
          `/admin/products/${existingProduct.id}`,
        ],
        tagsToRevalidate: [
          "get-single-product-for-edit",
          "get-products-for-table",
          "get-all-transactions",
        ],
      }),
    ]);

    return { success: true, message: "Product edited successfully." };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in editProduct server action: ", error.stack);
    }
    return { success: false, error: `Failed to edit product: ${error}` };
  }
}
