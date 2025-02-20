"use server";
import { auth } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import prisma from "@/prisma";
import cacheRevalidate from "@/utils/cache-revalidation-helper";
import { Settings } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";

async function getSettings(): Promise<Settings> {
  const settings = await prisma.settings.findFirst();

  if (!settings) {
    const newSettings = await prisma.settings.create({
      data: {
        customerMandatory: false,
        supplierMandatory: false,
      },
    });
    return newSettings;
  }

  return settings;
}

export const getCachedSettings = cache(
  async () => getSettings(),
  ["get-settings"]
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
