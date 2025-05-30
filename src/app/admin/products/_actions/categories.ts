"use server";
import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";

export async function createCategory(name: string) {
  if (!name) {
    throw new Error("Category name is required");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });
    if (existingCategory)
      throw new Error("Category with the same name already exists.");

    const newCategory = await prisma.category.create({
      data: { name },
    });

    const notificationMessage = `A new category *${name}* has been created.`;

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: [
          "/admin/products/categories",
          "/admin/products/new",
        ],
        tagsToRevalidate: ["get-categories"],
      }),
    ]);

    return { success: true, categoryId: newCategory.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createCategory server action: ", error.stack);
    }
    return { success: false, error: `Failed to create new category: ${error}` };
  }
}
interface EditCategoryPayload {
  name: string;
  categoryId: string;
}

export async function editCategory(data: EditCategoryPayload) {
  if (!data.name.trim()) {
    return { success: false, error: "Category name is required" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: data.categoryId },
      data: { name: data.name.trim() },
    });

    cacheRevalidate({
      routesToRevalidate: ["/admin/products/categories", "/admin/products/new"],
      tagsToRevalidate: ["get-categories"],
    });

    return { success: true, categoryId: updatedCategory.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in editCategory server action: ", error.stack);
    }
    return { success: false, error: `Failed to update category: ${error}` };
  }
}
