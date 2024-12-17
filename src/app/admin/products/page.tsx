import prisma from "@/prisma";
import { Product } from "@prisma/client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getData(): Promise<Product[]> {
  // Fetch data from your API here.
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return products;
}

export default async function ProductsPage() {
  const products = await getData();

  return (
    <Card className="border-none ">
      <CardHeader>
        <CardTitle>All Products</CardTitle>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <DataTable columns={columns} data={products} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
