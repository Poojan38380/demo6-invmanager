"use server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { UserWithCounts } from "@/types/dataTypes";
import { unstable_cache as cache, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sendTelegramMessage } from "@/lib/send-telegram-message";
import { revalidateTag } from "next/cache";

async function getAllUsers(): Promise<UserWithCounts[]> {
  return await prisma.user.findMany({
    include: {
      _count: {
        select: { products: true, transactions: true },
      },
    },
  });
}

export const getCachedUserList = cache(
  async () => getAllUsers(),
  ["get-all-users"]
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

    revalidateTag("get-all-users");
    revalidatePath("/admin/users");

    return { success: true, userId: CreatedUser.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addUser server action: ", error.stack);
    }
    return { success: false, error: `Failed to create user : ${error}` };
  }
}
