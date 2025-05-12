"use server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { UserWithCounts } from "@/types/dataTypes";
import { unstable_cache as cache } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import cacheRevalidate from "@/utils/cache-revalidation-helper";

async function getAllUsers(): Promise<UserWithCounts[]> {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      contact: true,
      profilePic: true,
      password: true,
      createdAt: true,
      isArchived: true,
      _count: {
        select: {
          products: true,
          transactions: true,
          Return: true
        }
      }
    },
    where: {
      isArchived: false
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export const getCachedUsers = cache(
  getAllUsers,
  ["get-all-users"],
  {
    revalidate: 60 * 5, // Revalidate every 5 minutes
    tags: ["users", "products", "transactions", "returns"]
  }
);

export async function addUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const creatorId = session.user.id;

  if (!creatorId) return redirect("/login");

  if (!password || !username) {
    throw new Error("All the fields are required.");
  }

  try {
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new Error("User not found in database.Login Again");
    }

    const user = await prisma.user.findFirst({ where: { username } });
    if (user) {
      throw new Error("Username already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const encodedUserName = username.split(" ").join("+");
    const profilePicURL = `https://ui-avatars.com/api/?background=random&name=${encodedUserName}&bold=true`;

    const CreatedUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        profilePic: profilePicURL,
      },
    });

    const newNotification = `.\n\nUser : ${CreatedUser.username} was created\n\n.`;
    await sendTelegramMessage(newNotification);

    await Promise.all([
      cacheRevalidate({
        routesToRevalidate: ["/admin/users"],
        tagsToRevalidate: ["get-all-users"],
      }),
    ]);

    return { success: true, userId: CreatedUser.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addUser server action: ", error.stack);
    }
    return { success: false, error: `Failed to create user : ${error}` };
  }
}

export async function changePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Ensure either the user is changing their own password or an admin is doing it
  if (session.user.id !== userId) {
    throw new Error("Unauthorized: You can only change your own password");
  }

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Send notification about password change
    const notification = `.\n\nUser: ${user.username} changed their password\n\n.`;
    await sendTelegramMessage(notification);

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in changePassword server action: ", error.stack);
    }
    return { success: false, error: `Failed to update password: ${error}` };
  }
}
