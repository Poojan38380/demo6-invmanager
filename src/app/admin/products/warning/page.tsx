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

export default async function WarningProducts() {
  const products = await getCachedProductsforTable();
  const approachingThreshold = 1.1; // 10% above buffer stock

  const warningProducts = products.filter((product) => {
    const bufferStock = product.bufferStock || 0;

    // Calculate actual stock based on whether product has variants
    const actualStock = product.hasVariants
      ? product.productVariants?.reduce(
          (sum, variant) => sum + variant.variantStock,
          0
        ) ?? 0
      : product.stock || 0;

    return (
      actualStock <= bufferStock * approachingThreshold &&
      actualStock >= bufferStock
    );
  });

  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader>
        <div className="flex items-center">
          <BackButton />
          <CardTitle className="text-warning">Warning Products</CardTitle>
        </div>
        <CardDescription>
          Products on the verge of becoming critical (stock is approaching
          min.stock)
        </CardDescription>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ProductDataTable columns={BasicColumns} data={warningProducts} />
      </CardContent>
    </Card>
  );
}
