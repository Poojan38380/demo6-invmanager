import React from "react";
import { getCachedProductsforTable } from "../_actions/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductDataTable } from "../_components/data-table";
import { BasicColumns } from "../_cloumns/basic-columns";

export default async function WarningProducts() {
  const products = await getCachedProductsforTable();
  const approachingThreshold = 1.1; // 10% above buffer stock

  const warningProducts = products.filter((product) => {
    const bufferStock = product.bufferStock || 0;
    return (
      product.stock <= bufferStock * approachingThreshold &&
      product.stock >= bufferStock
    );
  });

  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader>
        <CardTitle className="text-warning">Warning Products</CardTitle>
        <CardDescription>
          Products on the verge of becoming critical (stock is approching
          min.stock)
        </CardDescription>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ProductDataTable columns={BasicColumns} data={warningProducts} />
      </CardContent>
    </Card>
  );
}
