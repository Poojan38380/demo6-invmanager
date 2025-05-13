"use server";
import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { Settings } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function getSettings(): Promise<Settings> {
  try {
    const settings = await prisma.settings.findFirst({
      select: {
        id: true,
        customerMandatory: true,
        supplierMandatory: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!settings) {
      const newSettings = await prisma.settings.create({
        data: {
          customerMandatory: false,
          supplierMandatory: false,
        },
        select: {
          id: true,
          customerMandatory: true,
          supplierMandatory: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return newSettings;
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings if there's an error
    return {
      id: "",
      customerMandatory: false,
      supplierMandatory: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

export const getCachedSettings = cache(
  getSettings,
  ["get-settings"],
  {
    revalidate: 60 * 5, // Revalidate every 5 minutes
    tags: ["settings"]
  }
);

export async function updateSettings(
  customerMandatory: boolean,
  supplierMandatory: boolean
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const settings = await prisma.settings.findFirst();

    if (!settings) {
      await prisma.settings.create({
        data: {
          customerMandatory,
          supplierMandatory,
        },
      });
    } else {
      await prisma.settings.update({
        where: { id: settings.id },
        data: {
          customerMandatory,
          supplierMandatory,
        },
      });
    }

    const notificationMessage = `Inventory preferences have been changed.`;

    await Promise.all([
      sendTelegramMessage(notificationMessage),
      cacheRevalidate({
        routesToRevalidate: ["/admin/settings/preferences", "/admin/products"],
        tagsToRevalidate: ["get-products-for-table", "get-settings"],
      }),
    ]);

    return { success: true, message: "Settings updated successfully." };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in updateSettings server action: ", error.stack);
    }
    return {
      success: false,
      error: `Failed to change inventory preferences: ${error}`,
    };
  }
}
