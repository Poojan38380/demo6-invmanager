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

export default async function CriticalProducts() {
  const products = await getCachedProductsforTable();
  const criticalProducts = products.filter(
    (product) => product.stock < (product.bufferStock || 0)
  );

  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader>
        <CardTitle className="text-destructive">Critical Products</CardTitle>
        <CardDescription>
          Products with stock lesser than min.stock
        </CardDescription>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ProductDataTable columns={BasicColumns} data={criticalProducts} />
      </CardContent>
    </Card>
  );
}
