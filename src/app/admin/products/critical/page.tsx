import React from "react";
import { getCachedProductsforTable } from "../_actions/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ProductDataTable } from "../_components/data-table";
import { BasicColumns } from "../basic-columns";
import BackButton from "../../_components/sidebar/back-button";

export default async function CriticalProducts() {
  const products = await getCachedProductsforTable();
  const criticalProducts = products.filter(
    (product) => product.stock < (product.bufferStock || 0)
  );

  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader>
        <div className="flex items-center">
          <BackButton />
          <CardTitle className="text-destructive">Critical Products</CardTitle>
        </div>
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
