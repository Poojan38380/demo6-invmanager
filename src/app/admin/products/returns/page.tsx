import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import prisma from "@/prisma";
import ReturnsTable from "./_components/ReturnsTable";

export const dynamic = "force-dynamic";

async function getReturns() {
  try {
    const returns = await prisma.return.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        productVariant: {
          select: {
            id: true,
            variantName: true,
          },
        },
        customer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return returns;
  } catch (error) {
    console.error("Error fetching returns:", error);
    return [];
  }
}

export default async function ReturnsPage() {
  const returns = await getReturns();

  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Product Returns</CardTitle>
        <Link href="/admin/products/returns/file-new">
          <Button className="flex items-center gap-2 rounded-full">
            <PlusIcon size={16} />
            File New Return
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ReturnsTable returns={returns} />
      </CardContent>
    </Card>
  );
}
