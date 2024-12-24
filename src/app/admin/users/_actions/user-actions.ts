import prisma from "@/prisma";
import { UserWithCounts } from "@/types/dataTypes";
import { unstable_cache as cache } from "next/cache";

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
